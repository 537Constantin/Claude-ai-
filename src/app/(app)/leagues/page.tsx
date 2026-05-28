import type { Metadata } from "next";
import { LeaguesManager } from "@/components/leagues/leagues-manager";
import { Reveal } from "@/components/ui/reveal";
import { PROFILES, DEMO_USER_ID } from "@/lib/mock-data";

export const metadata: Metadata = { title: "Private Leagues" };

export default function LeaguesPage() {
  const friends = PROFILES.filter((p) => p.id !== DEMO_USER_ID).slice(0, 6);

  return (
    <div className="space-y-8">
      <Reveal>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-neon-green">
          Social
        </p>
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Private leagues
        </h1>
        <p className="mt-2 max-w-2xl text-ink-muted">
          Create a league, share the invite code, and battle your friends for
          the top spot. Bragging rights only.
        </p>
      </Reveal>

      <LeaguesManager friends={friends} />
    </div>
  );
}
