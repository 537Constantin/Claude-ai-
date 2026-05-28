-- ===========================================================================
-- KickOff — seed data (teams + a sample matchday)
-- Run after schema.sql:  psql < supabase/seed.sql   (or via the SQL editor)
-- ===========================================================================

insert into public.teams (id, name, short_name, tla, crest, league, position, played, points) values
  ('bl-fcb', 'Bayern München',      'Bayern',      'FCB', '🔴', 'BL1', 1, 30, 72),
  ('bl-b04', 'Bayer Leverkusen',    'Leverkusen',  'B04', '⚫', 'BL1', 2, 30, 70),
  ('bl-rbl', 'RB Leipzig',          'Leipzig',     'RBL', '🐂', 'BL1', 3, 30, 62),
  ('bl-bvb', 'Borussia Dortmund',   'Dortmund',    'BVB', '🟡', 'BL1', 4, 30, 60),
  ('bl-sge', 'Eintracht Frankfurt', 'Frankfurt',   'SGE', '🦅', 'BL1', 5, 30, 51),
  ('bl-vfb', 'VfB Stuttgart',       'Stuttgart',   'VFB', '⚪', 'BL1', 6, 30, 49),
  ('bl-wob', 'VfL Wolfsburg',       'Wolfsburg',   'WOB', '🐺', 'BL1', 9, 30, 37),
  ('bl-fcu', 'Union Berlin',        'Union',       'FCU', '🔺', 'BL1', 12, 30, 33),
  ('pl-mci', 'Manchester City',     'Man City',    'MCI', '🩵', 'PL', 1, 32, 76),
  ('pl-ars', 'Arsenal',             'Arsenal',     'ARS', '🔴', 'PL', 2, 32, 74),
  ('pl-liv', 'Liverpool',           'Liverpool',   'LIV', '🔴', 'PL', 3, 32, 71),
  ('pl-avl', 'Aston Villa',         'Aston Villa', 'AVL', '🟣', 'PL', 4, 32, 65),
  ('pl-tot', 'Tottenham Hotspur',   'Spurs',       'TOT', '⚪', 'PL', 5, 32, 60),
  ('pl-mun', 'Manchester United',   'Man Utd',     'MUN', '🔴', 'PL', 6, 32, 54),
  ('pl-che', 'Chelsea',             'Chelsea',     'CHE', '🔵', 'PL', 7, 32, 51),
  ('pl-new', 'Newcastle United',    'Newcastle',   'NEW', '⚫', 'PL', 8, 32, 50)
on conflict (id) do nothing;

insert into public.matches (id, league, matchday, home_team_id, away_team_id, kickoff, stadium, status, home_score, away_score, minute) values
  ('m1',  'BL1', 31, 'bl-fcb', 'bl-bvb', now() - interval '36 minutes', 'Allianz Arena',        'live',      2, 1, 67),
  ('m2',  'PL',  33, 'pl-ars', 'pl-liv', now() - interval '24 minutes', 'Emirates Stadium',     'live',      1, 1, 52),
  ('m3',  'BL1', 31, 'bl-rbl', 'bl-b04', now() + interval '3 hours',    'Red Bull Arena',       'scheduled', null, null, null),
  ('m4',  'PL',  33, 'pl-mci', 'pl-tot', now() + interval '5 hours',    'Etihad Stadium',       'scheduled', null, null, null),
  ('m5',  'BL1', 31, 'bl-sge', 'bl-vfb', now() + interval '26 hours',   'Deutsche Bank Park',   'scheduled', null, null, null),
  ('m6',  'PL',  33, 'pl-che', 'pl-mun', now() + interval '28 hours',   'Stamford Bridge',      'scheduled', null, null, null),
  ('m7',  'BL1', 31, 'bl-wob', 'bl-fcu', now() + interval '50 hours',   'Volkswagen Arena',     'scheduled', null, null, null),
  ('m8',  'PL',  33, 'pl-new', 'pl-avl', now() + interval '52 hours',   'St James'' Park',      'scheduled', null, null, null),
  ('m9',  'BL1', 30, 'bl-bvb', 'bl-rbl', now() - interval '3 days',     'Signal Iduna Park',    'finished',  3, 1, null),
  ('m10', 'PL',  32, 'pl-liv', 'pl-che', now() - interval '4 days',     'Anfield',              'finished',  2, 2, null),
  ('m11', 'PL',  32, 'pl-tot', 'pl-mun', now() - interval '4 days',     'Tottenham Stadium',    'finished',  1, 0, null),
  ('m12', 'BL1', 30, 'bl-b04', 'bl-fcb', now() - interval '5 days',     'BayArena',             'finished',  2, 0, null)
on conflict (id) do nothing;
