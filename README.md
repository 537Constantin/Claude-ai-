# ⚽ KickOff — Football Prediction Platform

A modern, production-ready football tipping game for the **Bundesliga** and
**Premier League**. Predict match results, earn points, and climb global,
weekly, and private-league leaderboards. **No real money — just glory.**

Built with a premium dark UI: glassmorphism, subtle neon accents, smooth
Framer Motion animations, and full mobile/tablet/desktop responsiveness.

---

## Tech stack

| Layer       | Choice                                            |
| ----------- | ------------------------------------------------- |
| Framework   | **Next.js 15** (App Router) + React 19            |
| Language    | **TypeScript** (strict)                           |
| Styling     | **TailwindCSS** + custom design tokens            |
| Animation   | **Framer Motion**                                 |
| Backend     | **Supabase** (PostgreSQL + Auth + RLS)            |
| Auth        | **Google OAuth + Email/Password**                 |
| Icons       | **lucide-react**                                  |
| Theming     | **next-themes** (dark / light)                    |

> **Runs with zero setup.** Without Supabase env vars the app serves a rich
> built-in demo dataset so every screen is fully explorable. Add the env vars
> to switch on real auth + persistence — no code changes required.

---

## Getting started

```bash
npm install
cp .env.example .env.local   # optional — leave blank for demo mode
npm run dev                  # http://localhost:3000
```

### Enabling Supabase (optional)

1. Create a project at [supabase.com](https://supabase.com).
2. Run the SQL in [`supabase/schema.sql`](supabase/schema.sql) then
   [`supabase/seed.sql`](supabase/seed.sql) in the SQL editor.
3. Enable the **Google** provider under _Authentication → Providers_ and add
   `https://<your-domain>/auth/callback` as a redirect URL.
4. Fill in `.env.local`:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

---

## Points system

| Result               | Points |
| -------------------- | ------ |
| Exact final score    | **+5** |
| Correct winner/draw  | **+3** |
| Wrong                | **0**  |

Scoring is centralised in [`src/lib/scoring.ts`](src/lib/scoring.ts) and
mirrored 1:1 by the `score_prediction` SQL function. When a match flips to
`finished`, a Postgres trigger settles every prediction and rolls points into
each player's profile automatically.

---

## Project structure

```
src/
├─ app/
│  ├─ (app)/                 # Authenticated shell (navbar + bottom nav)
│  │  ├─ dashboard/          # Stats, next matches, recent tips, mini board
│  │  ├─ matches/            # Filterable fixtures + prediction picker
│  │  ├─ leaderboard/        # Global / weekly podium + table
│  │  ├─ leagues/            # Private leagues + friends
│  │  └─ profile/            # User profile + full prediction history
│  ├─ (auth)/                # login / register (centered glass card)
│  ├─ auth/                  # OAuth callback + signout route handlers
│  ├─ page.tsx               # Marketing landing page
│  ├─ layout.tsx             # Root layout + theme provider
│  └─ globals.css            # Design tokens + glass/neon utilities
├─ components/
│  ├─ ui/                    # Button, GlassCard, Badge, Avatar, Reveal…
│  ├─ layout/                # Navbar, MobileNav, Footer, ThemeToggle, Logo
│  ├─ matches/               # MatchCard, PredictionPicker, Countdown, …
│  ├─ leaderboard/           # Podium, LeaderboardTable, LeaderboardView
│  ├─ dashboard/             # StatCard
│  ├─ leagues/               # LeaguesManager
│  ├─ landing/               # Hero, Features, HowItWorks, CTA, …
│  └─ providers/             # ThemeProvider
├─ lib/
│  ├─ types.ts               # Domain models
│  ├─ constants.ts           # Leagues, points, nav, site meta
│  ├─ scoring.ts             # Points engine (source of truth)
│  ├─ data.ts                # Data-access seam (mock ↔ Supabase)
│  ├─ mock-data.ts           # Built-in demo dataset
│  ├─ utils.ts               # cn(), formatting helpers
│  └─ supabase/              # Browser/server/middleware clients
└─ hooks/
   └─ use-countdown.ts       # Live kickoff countdown
supabase/
├─ schema.sql                # Tables, RLS, scoring triggers
└─ seed.sql                  # Teams + a sample matchday
```

---

## Features

- **Landing page** — animated hero, feature grid, how-it-works, live
  leaderboard preview, CTA.
- **Match cards** — team crests, kickoff/stadium/table position, live badges,
  ticking countdowns.
- **Prediction picker** — 1/X/2 selector + exact-score steppers with instant
  points preview.
- **Leaderboards** — global & weekly tabs, animated podium, movement arrows,
  "top winner of the week".
- **Dashboard** — points, rank, win rate, exact-score stats, next matches,
  recent tips, favourite league.
- **Private leagues** — create, share invite codes, join, friends list.
- **Live feeling** — countdowns, live status badges, in-play indicators.
- **Dark / light mode**, fully **responsive**, installable **PWA** manifest.

---

## Deployment

Deploy to [Vercel](https://vercel.com) (zero-config for Next.js):

1. Push this repo and import it in Vercel.
2. Add the `NEXT_PUBLIC_*` env vars (and `SUPABASE_SERVICE_ROLE_KEY` if used).
3. Ship. 🚀

---

## Scripts

```bash
npm run dev        # start dev server
npm run build      # production build
npm run start      # serve production build
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
```

> _KickOff is a for-fun prediction game. No real money, no gambling._
