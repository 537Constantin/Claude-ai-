// ---------------------------------------------------------------------------
// Data-access layer.
//
// This is the single seam between the UI and the data source. Today it serves
// the built-in demo dataset so the product is fully explorable with zero setup.
// When Supabase is configured, swap the bodies here for queries against the
// schema in `supabase/schema.sql` — the return types stay identical, so no UI
// changes are required.
// ---------------------------------------------------------------------------

import type {
  LeaderboardRow,
  LeagueCode,
  MatchWithTeams,
  Profile,
} from "./types";
import {
  DEMO_USER_ID,
  PREDICTIONS,
  PROFILES,
  buildMatchesWithTeams,
} from "./mock-data";
import { winRate } from "./utils";

export function getMatches(filter?: {
  league?: LeagueCode;
  status?: MatchWithTeams["status"];
}): MatchWithTeams[] {
  let matches = buildMatchesWithTeams();
  if (filter?.league) matches = matches.filter((m) => m.league === filter.league);
  if (filter?.status) matches = matches.filter((m) => m.status === filter.status);
  return matches.sort(
    (a, b) => new Date(a.kickoff).getTime() - new Date(b.kickoff).getTime()
  );
}

export function getUpcomingMatches(limit = 4): MatchWithTeams[] {
  return getMatches({ status: "scheduled" }).slice(0, limit);
}

export function getLiveMatches(): MatchWithTeams[] {
  return getMatches({ status: "live" });
}

export function getCurrentProfile(): Profile {
  return PROFILES.find((p) => p.id === DEMO_USER_ID) ?? PROFILES[0];
}

export function getLeaderboard(
  metric: "totalPoints" | "weeklyPoints" = "totalPoints"
): LeaderboardRow[] {
  const sorted = [...PROFILES].sort((a, b) => b[metric] - a[metric]);
  return sorted.map((profile, i) => ({
    rank: i + 1,
    profile,
    // Deterministic pseudo-movement for the demo (climbing/sliding arrows).
    movement: ((profile.username.length + i) % 5) - 2,
  }));
}

export interface UserStats {
  winRate: number;
  exactRate: number;
  totalPoints: number;
  weeklyPoints: number;
  predictionCount: number;
  exactCount: number;
  correctCount: number;
  rank: number;
  favoriteLeague: LeagueCode | null;
}

export function getUserStats(): UserStats {
  const profile = getCurrentProfile();
  const rank =
    getLeaderboard().find((r) => r.profile.id === profile.id)?.rank ?? 0;
  return {
    winRate: winRate(profile.correctCount, profile.predictionCount),
    exactRate: winRate(profile.exactCount, profile.predictionCount),
    totalPoints: profile.totalPoints,
    weeklyPoints: profile.weeklyPoints,
    predictionCount: profile.predictionCount,
    exactCount: profile.exactCount,
    correctCount: profile.correctCount,
    rank,
    favoriteLeague: profile.favoriteLeague,
  };
}

/** The demo user's predictions joined with their matches, newest first. */
export function getUserPredictions(): MatchWithTeams[] {
  const matchIds = new Set(
    PREDICTIONS.filter((p) => p.userId === DEMO_USER_ID).map((p) => p.matchId)
  );
  return buildMatchesWithTeams()
    .filter((m) => matchIds.has(m.id))
    .sort(
      (a, b) => new Date(b.kickoff).getTime() - new Date(a.kickoff).getTime()
    );
}
