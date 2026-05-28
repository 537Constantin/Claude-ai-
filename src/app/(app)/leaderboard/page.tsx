import type { Metadata } from "next";
import { LeaderboardView } from "@/components/leaderboard/leaderboard-view";
import { Reveal } from "@/components/ui/reveal";
import { getLeaderboard } from "@/lib/data";

export const metadata: Metadata = { title: "Leaderboard" };

export default function LeaderboardPage() {
  const global = getLeaderboard("totalPoints");
  const weekly = getLeaderboard("weeklyPoints");

  return (
    <div className="space-y-8">
      <Reveal className="text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-neon-green">
          Standings
        </p>
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          The Leaderboard
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-ink-muted">
          Climb the ranks with every correct call. Exact scores are worth more —
          go bold to break into the top three.
        </p>
      </Reveal>

      <LeaderboardView global={global} weekly={weekly} />
    </div>
  );
}
