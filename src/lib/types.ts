// ---------------------------------------------------------------------------
// Domain types shared across the app (mirrors the Supabase schema).
// ---------------------------------------------------------------------------

export type LeagueCode = "BL1" | "PL";

export type MatchStatus = "scheduled" | "live" | "finished";

/** The three "outcome" tips + an exact-score tip. */
export type Outcome = "HOME" | "DRAW" | "AWAY";

export interface League {
  code: LeagueCode;
  name: string;
  country: string;
  /** Short tag shown on badges, e.g. "BUNDESLIGA". */
  tag: string;
  accent: string; // tailwind-friendly hex used for league accenting
}

export interface Team {
  id: string;
  name: string;
  shortName: string;
  /** 3-letter code, e.g. "FCB". */
  tla: string;
  crest: string; // emoji or image url
  league: LeagueCode;
  /** Current table position (1 = top). */
  position: number;
  played: number;
  points: number;
  /** Tailwind gradient stops used for the team chip. */
  color: string;
}

export interface Match {
  id: string;
  league: LeagueCode;
  matchday: number;
  homeTeamId: string;
  awayTeamId: string;
  /** ISO timestamp of kickoff. */
  kickoff: string;
  stadium: string;
  status: MatchStatus;
  /** Populated once the match is live/finished. */
  homeScore: number | null;
  awayScore: number | null;
  /** For live matches: elapsed minutes. */
  minute?: number | null;
}

export interface Prediction {
  id: string;
  matchId: string;
  userId: string;
  outcome: Outcome;
  homeScore: number;
  awayScore: number;
  createdAt: string;
  /** Awarded once the match is scored. null = not yet scored. */
  pointsAwarded: number | null;
}

export interface Profile {
  id: string;
  username: string;
  avatar: string; // emoji or url
  totalPoints: number;
  weeklyPoints: number;
  exactCount: number;
  correctCount: number;
  predictionCount: number;
  favoriteLeague: LeagueCode | null;
  joinedAt: string;
}

export interface LeaderboardRow {
  rank: number;
  profile: Profile;
  /** delta vs. previous snapshot (positive = climbing). */
  movement: number;
}

export interface PrivateLeague {
  id: string;
  name: string;
  code: string; // invite code
  ownerId: string;
  memberCount: number;
  createdAt: string;
}

/** A match enriched with both team records — convenient for the UI. */
export interface MatchWithTeams extends Match {
  homeTeam: Team;
  awayTeam: Team;
  /** The signed-in user's prediction for this match, if any. */
  prediction?: Prediction | null;
}
