import type { Metadata } from "next";
import { MatchesBrowser } from "@/components/matches/matches-browser";
import { Reveal } from "@/components/ui/reveal";
import { getMatches } from "@/lib/data";

export const metadata: Metadata = { title: "Matches" };

export default function MatchesPage() {
  const matches = getMatches();

  return (
    <div className="space-y-6">
      <Reveal>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-neon-green">
          Fixtures
        </p>
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Place your tips
        </h1>
        <p className="mt-2 max-w-2xl text-ink-muted">
          Pick the winner or call the exact score. Lock in your prediction
          before kickoff to earn points.
        </p>
      </Reveal>

      <MatchesBrowser matches={matches} />
    </div>
  );
}
