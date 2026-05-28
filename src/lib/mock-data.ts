import type {
  Match,
  MatchWithTeams,
  Prediction,
  Profile,
  Team,
} from "./types";
import { scorePrediction } from "./scoring";

// ---------------------------------------------------------------------------
// Built-in demo dataset. Used whenever Supabase isn't configured so the whole
// UI is explorable instantly. Crests use emoji to stay dependency-free.
// ---------------------------------------------------------------------------

export const TEAMS: Team[] = [
  // --- Bundesliga ---
  { id: "bl-fcb", name: "Bayern München", shortName: "Bayern", tla: "FCB", crest: "🔴", league: "BL1", position: 1, played: 30, points: 72, color: "from-red-600 to-red-500" },
  { id: "bl-bvb", name: "Borussia Dortmund", shortName: "Dortmund", tla: "BVB", crest: "🟡", league: "BL1", position: 4, played: 30, points: 60, color: "from-yellow-400 to-amber-500" },
  { id: "bl-rbl", name: "RB Leipzig", shortName: "Leipzig", tla: "RBL", crest: "🐂", league: "BL1", position: 3, played: 30, points: 62, color: "from-red-500 to-rose-400" },
  { id: "bl-b04", name: "Bayer Leverkusen", shortName: "Leverkusen", tla: "B04", crest: "⚫", league: "BL1", position: 2, played: 30, points: 70, color: "from-red-600 to-zinc-900" },
  { id: "bl-sge", name: "Eintracht Frankfurt", shortName: "Frankfurt", tla: "SGE", crest: "🦅", league: "BL1", position: 5, played: 30, points: 51, color: "from-zinc-900 to-red-700" },
  { id: "bl-vfb", name: "VfB Stuttgart", shortName: "Stuttgart", tla: "VFB", crest: "⚪", league: "BL1", position: 6, played: 30, points: 49, color: "from-red-500 to-white/30" },
  { id: "bl-wob", name: "VfL Wolfsburg", shortName: "Wolfsburg", tla: "WOB", crest: "🐺", league: "BL1", position: 9, played: 30, points: 37, color: "from-green-600 to-emerald-500" },
  { id: "bl-fcu", name: "Union Berlin", shortName: "Union", tla: "FCU", crest: "🔺", league: "BL1", position: 12, played: 30, points: 33, color: "from-red-600 to-yellow-400" },

  // --- Premier League ---
  { id: "pl-mci", name: "Manchester City", shortName: "Man City", tla: "MCI", crest: "🩵", league: "PL", position: 1, played: 32, points: 76, color: "from-sky-400 to-sky-500" },
  { id: "pl-ars", name: "Arsenal", shortName: "Arsenal", tla: "ARS", crest: "🔴", league: "PL", position: 2, played: 32, points: 74, color: "from-red-600 to-rose-500" },
  { id: "pl-liv", name: "Liverpool", shortName: "Liverpool", tla: "LIV", crest: "🔴", league: "PL", position: 3, played: 32, points: 71, color: "from-red-700 to-red-500" },
  { id: "pl-tot", name: "Tottenham Hotspur", shortName: "Spurs", tla: "TOT", crest: "⚪", league: "PL", position: 5, played: 32, points: 60, color: "from-white/40 to-indigo-900" },
  { id: "pl-che", name: "Chelsea", shortName: "Chelsea", tla: "CHE", crest: "🔵", league: "PL", position: 7, played: 32, points: 51, color: "from-blue-700 to-blue-500" },
  { id: "pl-mun", name: "Manchester United", shortName: "Man Utd", tla: "MUN", crest: "🔴", league: "PL", position: 6, played: 32, points: 54, color: "from-red-600 to-red-700" },
  { id: "pl-new", name: "Newcastle United", shortName: "Newcastle", tla: "NEW", crest: "⚫", league: "PL", position: 8, played: 32, points: 50, color: "from-zinc-900 to-zinc-700" },
  { id: "pl-avl", name: "Aston Villa", shortName: "Aston Villa", tla: "AVL", crest: "🟣", league: "PL", position: 4, played: 32, points: 65, color: "from-purple-800 to-sky-300" },
];

const teamById = new Map(TEAMS.map((t) => [t.id, t]));
export function getTeam(id: string): Team {
  const t = teamById.get(id);
  if (!t) throw new Error(`Unknown team: ${id}`);
  return t;
}

// Build matches relative to "now" so countdowns and live badges stay realistic.
const now = Date.now();
const hours = (h: number) => new Date(now + h * 3600_000).toISOString();

export const MATCHES: Match[] = [
  // Live now
  { id: "m1", league: "BL1", matchday: 31, homeTeamId: "bl-fcb", awayTeamId: "bl-bvb", kickoff: hours(-0.6), stadium: "Allianz Arena", status: "live", homeScore: 2, awayScore: 1, minute: 67 },
  { id: "m2", league: "PL", matchday: 33, homeTeamId: "pl-ars", awayTeamId: "pl-liv", kickoff: hours(-0.4), stadium: "Emirates Stadium", status: "live", homeScore: 1, awayScore: 1, minute: 52 },

  // Upcoming (soon)
  { id: "m3", league: "BL1", matchday: 31, homeTeamId: "bl-rbl", awayTeamId: "bl-b04", kickoff: hours(3), stadium: "Red Bull Arena", status: "scheduled", homeScore: null, awayScore: null },
  { id: "m4", league: "PL", matchday: 33, homeTeamId: "pl-mci", awayTeamId: "pl-tot", kickoff: hours(5.5), stadium: "Etihad Stadium", status: "scheduled", homeScore: null, awayScore: null },
  { id: "m5", league: "BL1", matchday: 31, homeTeamId: "bl-sge", awayTeamId: "bl-vfb", kickoff: hours(26), stadium: "Deutsche Bank Park", status: "scheduled", homeScore: null, awayScore: null },
  { id: "m6", league: "PL", matchday: 33, homeTeamId: "pl-che", awayTeamId: "pl-mun", kickoff: hours(28), stadium: "Stamford Bridge", status: "scheduled", homeScore: null, awayScore: null },
  { id: "m7", league: "BL1", matchday: 31, homeTeamId: "bl-wob", awayTeamId: "bl-fcu", kickoff: hours(50), stadium: "Volkswagen Arena", status: "scheduled", homeScore: null, awayScore: null },
  { id: "m8", league: "PL", matchday: 33, homeTeamId: "pl-new", awayTeamId: "pl-avl", kickoff: hours(52), stadium: "St James' Park", status: "scheduled", homeScore: null, awayScore: null },

  // Finished (for stats / scored predictions)
  { id: "m9", league: "BL1", matchday: 30, homeTeamId: "bl-bvb", awayTeamId: "bl-rbl", kickoff: hours(-72), stadium: "Signal Iduna Park", status: "finished", homeScore: 3, awayScore: 1 },
  { id: "m10", league: "PL", matchday: 32, homeTeamId: "pl-liv", awayTeamId: "pl-che", kickoff: hours(-96), stadium: "Anfield", status: "finished", homeScore: 2, awayScore: 2 },
  { id: "m11", league: "PL", matchday: 32, homeTeamId: "pl-tot", awayTeamId: "pl-mun", kickoff: hours(-100), stadium: "Tottenham Hotspur Stadium", status: "finished", homeScore: 1, awayScore: 0 },
  { id: "m12", league: "BL1", matchday: 30, homeTeamId: "bl-b04", awayTeamId: "bl-fcb", kickoff: hours(-120), stadium: "BayArena", status: "finished", homeScore: 2, awayScore: 0 },
];

export const DEMO_USER_ID = "user-you";

// The signed-in demo user's predictions.
const rawPredictions: Omit<Prediction, "pointsAwarded">[] = [
  { id: "p1", matchId: "m1", userId: DEMO_USER_ID, outcome: "HOME", homeScore: 2, awayScore: 1, createdAt: hours(-5) },
  { id: "p2", matchId: "m2", userId: DEMO_USER_ID, outcome: "DRAW", homeScore: 1, awayScore: 1, createdAt: hours(-6) },
  { id: "p3", matchId: "m3", userId: DEMO_USER_ID, outcome: "HOME", homeScore: 2, awayScore: 0, createdAt: hours(-2) },
  { id: "p4", matchId: "m9", userId: DEMO_USER_ID, outcome: "HOME", homeScore: 3, awayScore: 1, createdAt: hours(-80) },
  { id: "p5", matchId: "m10", userId: DEMO_USER_ID, outcome: "HOME", homeScore: 2, awayScore: 1, createdAt: hours(-110) },
  { id: "p6", matchId: "m11", userId: DEMO_USER_ID, outcome: "HOME", homeScore: 2, awayScore: 1, createdAt: hours(-110) },
  { id: "p7", matchId: "m12", userId: DEMO_USER_ID, outcome: "AWAY", homeScore: 1, awayScore: 2, createdAt: hours(-130) },
];

const matchById = new Map(MATCHES.map((m) => [m.id, m]));

export const PREDICTIONS: Prediction[] = rawPredictions.map((p) => {
  const match = matchById.get(p.matchId)!;
  const pointsAwarded =
    match.status === "finished" &&
    match.homeScore !== null &&
    match.awayScore !== null
      ? scorePrediction({
          predicted: { outcome: p.outcome, homeScore: p.homeScore, awayScore: p.awayScore },
          actual: { homeScore: match.homeScore, awayScore: match.awayScore },
        })
      : null;
  return { ...p, pointsAwarded };
});

export const PROFILES: Profile[] = [
  { id: "user-you", username: "you", avatar: "⚡", totalPoints: 247, weeklyPoints: 38, exactCount: 14, correctCount: 53, predictionCount: 92, favoriteLeague: "BL1", joinedAt: hours(-24 * 90) },
  { id: "user-1", username: "TipKing_Max", avatar: "👑", totalPoints: 412, weeklyPoints: 51, exactCount: 28, correctCount: 88, predictionCount: 120, favoriteLeague: "BL1", joinedAt: hours(-24 * 200) },
  { id: "user-2", username: "GegenpressGuru", avatar: "🔥", totalPoints: 389, weeklyPoints: 47, exactCount: 25, correctCount: 81, predictionCount: 118, favoriteLeague: "BL1", joinedAt: hours(-24 * 180) },
  { id: "user-3", username: "AnfieldAnna", avatar: "🌟", totalPoints: 366, weeklyPoints: 44, exactCount: 22, correctCount: 79, predictionCount: 115, favoriteLeague: "PL", joinedAt: hours(-24 * 150) },
  { id: "user-4", username: "xG_Wizard", avatar: "🧙", totalPoints: 341, weeklyPoints: 29, exactCount: 19, correctCount: 74, predictionCount: 112, favoriteLeague: "PL", joinedAt: hours(-24 * 140) },
  { id: "user-5", username: "DerKaiser", avatar: "🎩", totalPoints: 318, weeklyPoints: 33, exactCount: 17, correctCount: 70, predictionCount: 108, favoriteLeague: "BL1", joinedAt: hours(-24 * 130) },
  { id: "user-6", username: "VARdecision", avatar: "📺", totalPoints: 295, weeklyPoints: 41, exactCount: 15, correctCount: 64, predictionCount: 100, favoriteLeague: "PL", joinedAt: hours(-24 * 110) },
  { id: "user-7", username: "SüdkurveSam", avatar: "🟡", totalPoints: 271, weeklyPoints: 22, exactCount: 13, correctCount: 60, predictionCount: 98, favoriteLeague: "BL1", joinedAt: hours(-24 * 95) },
  { id: "user-8", username: "PoissonPete", avatar: "🎯", totalPoints: 233, weeklyPoints: 36, exactCount: 11, correctCount: 49, predictionCount: 90, favoriteLeague: "PL", joinedAt: hours(-24 * 80) },
  { id: "user-9", username: "TikiTakaTom", avatar: "🥅", totalPoints: 208, weeklyPoints: 18, exactCount: 9, correctCount: 44, predictionCount: 85, favoriteLeague: "PL", joinedAt: hours(-24 * 70) },
  { id: "user-10", username: "BoxToBoxBea", avatar: "💎", totalPoints: 187, weeklyPoints: 27, exactCount: 8, correctCount: 40, predictionCount: 78, favoriteLeague: "BL1", joinedAt: hours(-24 * 60) },
];

/** Join matches with their teams + the demo user's prediction. */
export function buildMatchesWithTeams(
  matches: Match[] = MATCHES,
  predictions: Prediction[] = PREDICTIONS
): MatchWithTeams[] {
  const predByMatch = new Map(predictions.map((p) => [p.matchId, p]));
  return matches.map((m) => ({
    ...m,
    homeTeam: getTeam(m.homeTeamId),
    awayTeam: getTeam(m.awayTeamId),
    prediction: predByMatch.get(m.id) ?? null,
  }));
}
