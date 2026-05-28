import type { League } from "./types";

export const POINTS = {
  /** Correct winner / draw tip. */
  CORRECT_OUTCOME: 3,
  /** Exact final score (also counts as a correct outcome — total = this value). */
  EXACT_SCORE: 5,
  WRONG: 0,
} as const;

export const LEAGUES: Record<League["code"], League> = {
  BL1: {
    code: "BL1",
    name: "Bundesliga",
    country: "Germany",
    tag: "BUNDESLIGA",
    accent: "#d20515",
  },
  PL: {
    code: "PL",
    name: "Premier League",
    country: "England",
    tag: "PREMIER LEAGUE",
    accent: "#38003c",
  },
};

export const LEAGUE_LIST = Object.values(LEAGUES);

export const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/matches", label: "Matches" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/leagues", label: "Leagues" },
] as const;

export const SITE = {
  name: "KickOff",
  tagline: "Predict football. Earn bragging rights.",
  description:
    "A modern football prediction game for the Bundesliga & Premier League. No real money — just pure tipping glory.",
} as const;
