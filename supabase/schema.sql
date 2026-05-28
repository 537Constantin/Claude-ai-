-- ===========================================================================
-- KickOff — PostgreSQL / Supabase schema
-- ---------------------------------------------------------------------------
-- Run in the Supabase SQL editor (or `supabase db push`). Sets up tables, row
-- level security, the points engine, and the profile/leaderboard plumbing.
-- ===========================================================================

create extension if not exists "uuid-ossp";

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
do $$ begin
  create type league_code as enum ('BL1', 'PL');
exception when duplicate_object then null; end $$;

do $$ begin
  create type match_status as enum ('scheduled', 'live', 'finished');
exception when duplicate_object then null; end $$;

do $$ begin
  create type outcome as enum ('HOME', 'DRAW', 'AWAY');
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------------
-- profiles  (1:1 with auth.users)
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id             uuid primary key references auth.users(id) on delete cascade,
  username       text unique not null,
  avatar         text not null default '⚽',
  total_points   integer not null default 0,
  weekly_points  integer not null default 0,
  exact_count    integer not null default 0,
  correct_count  integer not null default 0,
  prediction_count integer not null default 0,
  favorite_league league_code,
  created_at     timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- teams
-- ---------------------------------------------------------------------------
create table if not exists public.teams (
  id          text primary key,
  name        text not null,
  short_name  text not null,
  tla         text not null,
  crest       text not null,
  league      league_code not null,
  position    integer not null default 0,
  played      integer not null default 0,
  points      integer not null default 0
);

-- ---------------------------------------------------------------------------
-- matches
-- ---------------------------------------------------------------------------
create table if not exists public.matches (
  id            text primary key,
  league        league_code not null,
  matchday      integer not null,
  home_team_id  text not null references public.teams(id),
  away_team_id  text not null references public.teams(id),
  kickoff       timestamptz not null,
  stadium       text not null,
  status        match_status not null default 'scheduled',
  home_score    integer,
  away_score    integer,
  minute        integer,
  created_at    timestamptz not null default now()
);
create index if not exists matches_kickoff_idx on public.matches (kickoff);
create index if not exists matches_status_idx on public.matches (status);

-- ---------------------------------------------------------------------------
-- predictions  (one per user per match)
-- ---------------------------------------------------------------------------
create table if not exists public.predictions (
  id             uuid primary key default uuid_generate_v4(),
  match_id       text not null references public.matches(id) on delete cascade,
  user_id        uuid not null references public.profiles(id) on delete cascade,
  outcome        outcome not null,
  home_score     integer not null check (home_score >= 0 and home_score <= 30),
  away_score     integer not null check (away_score >= 0 and away_score <= 30),
  points_awarded integer,
  created_at     timestamptz not null default now(),
  unique (match_id, user_id)
);
create index if not exists predictions_user_idx on public.predictions (user_id);

-- ---------------------------------------------------------------------------
-- private leagues + membership
-- ---------------------------------------------------------------------------
create table if not exists public.private_leagues (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  code        text unique not null,
  owner_id    uuid not null references public.profiles(id) on delete cascade,
  created_at  timestamptz not null default now()
);

create table if not exists public.league_members (
  league_id  uuid not null references public.private_leagues(id) on delete cascade,
  user_id    uuid not null references public.profiles(id) on delete cascade,
  joined_at  timestamptz not null default now(),
  primary key (league_id, user_id)
);

-- ---------------------------------------------------------------------------
-- friendships (symmetric pair stored once, lowest id first)
-- ---------------------------------------------------------------------------
create table if not exists public.friendships (
  user_a     uuid not null references public.profiles(id) on delete cascade,
  user_b     uuid not null references public.profiles(id) on delete cascade,
  status     text not null default 'accepted' check (status in ('pending', 'accepted')),
  created_at timestamptz not null default now(),
  primary key (user_a, user_b),
  check (user_a < user_b)
);

-- ===========================================================================
-- Points engine
-- ===========================================================================

-- Single source of truth for scoring — mirrors src/lib/scoring.ts.
--   exact score  -> 5
--   right winner -> 3
--   otherwise    -> 0
create or replace function public.score_prediction(
  p_outcome outcome,
  p_home integer,
  p_away integer,
  a_home integer,
  a_away integer
) returns integer
language plpgsql immutable as $$
declare
  actual_outcome outcome;
begin
  if p_home = a_home and p_away = a_away then
    return 5;
  end if;

  actual_outcome := case
    when a_home > a_away then 'HOME'::outcome
    when a_home < a_away then 'AWAY'::outcome
    else 'DRAW'::outcome
  end;

  if p_outcome = actual_outcome then
    return 3;
  end if;

  return 0;
end;
$$;

-- When a match flips to 'finished' with a score, score every prediction and
-- roll the points up into each player's profile counters.
create or replace function public.settle_match() returns trigger
language plpgsql security definer as $$
declare
  rec record;
  pts integer;
begin
  if new.status = 'finished'
     and new.home_score is not null
     and new.away_score is not null
     and (old.status is distinct from 'finished') then

    for rec in
      select * from public.predictions where match_id = new.id
    loop
      pts := public.score_prediction(
        rec.outcome, rec.home_score, rec.away_score,
        new.home_score, new.away_score
      );

      update public.predictions
        set points_awarded = pts
        where id = rec.id;

      update public.profiles set
        total_points  = total_points + pts,
        weekly_points = weekly_points + pts,
        exact_count   = exact_count + (case when pts = 5 then 1 else 0 end),
        correct_count = correct_count + (case when pts >= 3 then 1 else 0 end)
      where id = rec.user_id;
    end loop;
  end if;

  return new;
end;
$$;

drop trigger if exists trg_settle_match on public.matches;
create trigger trg_settle_match
  after update on public.matches
  for each row execute function public.settle_match();

-- Keep prediction_count accurate as tips are placed.
create or replace function public.bump_prediction_count() returns trigger
language plpgsql security definer as $$
begin
  update public.profiles
    set prediction_count = prediction_count + 1
    where id = new.user_id;
  return new;
end;
$$;

drop trigger if exists trg_bump_prediction_count on public.predictions;
create trigger trg_bump_prediction_count
  after insert on public.predictions
  for each row execute function public.bump_prediction_count();

-- Auto-create a profile when a new auth user signs up.
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, username, avatar)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data->>'username',
      split_part(new.email, '@', 1)
    ),
    coalesce(new.raw_user_meta_data->>'avatar', '⚽')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Weekly reset — schedule via pg_cron, e.g. every Monday 00:00.
--   select cron.schedule('weekly-reset', '0 0 * * 1',
--     $$ update public.profiles set weekly_points = 0 $$);

-- ===========================================================================
-- Row Level Security
-- ===========================================================================
alter table public.profiles        enable row level security;
alter table public.teams           enable row level security;
alter table public.matches         enable row level security;
alter table public.predictions     enable row level security;
alter table public.private_leagues enable row level security;
alter table public.league_members  enable row level security;
alter table public.friendships     enable row level security;

-- Profiles: public read, owner write.
create policy "profiles_read"   on public.profiles for select using (true);
create policy "profiles_update" on public.profiles for update using (auth.uid() = id);

-- Teams & matches: public read only (managed by service role / ETL).
create policy "teams_read"   on public.teams   for select using (true);
create policy "matches_read" on public.matches for select using (true);

-- Predictions: read all (leaderboards), but only mutate your own — and only
-- before the match kicks off.
create policy "predictions_read" on public.predictions for select using (true);

create policy "predictions_insert" on public.predictions
  for insert with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.matches m
      where m.id = match_id and m.status = 'scheduled' and m.kickoff > now()
    )
  );

create policy "predictions_update" on public.predictions
  for update using (auth.uid() = user_id)
  with check (
    exists (
      select 1 from public.matches m
      where m.id = match_id and m.status = 'scheduled' and m.kickoff > now()
    )
  );

-- Private leagues: members can read; owner manages.
create policy "leagues_read" on public.private_leagues
  for select using (
    auth.uid() = owner_id
    or exists (
      select 1 from public.league_members lm
      where lm.league_id = id and lm.user_id = auth.uid()
    )
  );
create policy "leagues_insert" on public.private_leagues
  for insert with check (auth.uid() = owner_id);
create policy "leagues_delete" on public.private_leagues
  for delete using (auth.uid() = owner_id);

-- Membership: you can see/join/leave your own rows.
create policy "members_read"   on public.league_members for select using (true);
create policy "members_insert" on public.league_members
  for insert with check (auth.uid() = user_id);
create policy "members_delete" on public.league_members
  for delete using (auth.uid() = user_id);

-- Friendships: visible to either side; either party can create/remove.
create policy "friends_read" on public.friendships
  for select using (auth.uid() = user_a or auth.uid() = user_b);
create policy "friends_insert" on public.friendships
  for insert with check (auth.uid() = user_a or auth.uid() = user_b);
create policy "friends_delete" on public.friendships
  for delete using (auth.uid() = user_a or auth.uid() = user_b);
