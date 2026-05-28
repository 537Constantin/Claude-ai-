import { ArrowRight } from "lucide-react";
import { Container, SectionHeader } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { LeaderboardTable } from "@/components/leaderboard/leaderboard-table";
import { getLeaderboard } from "@/lib/data";

export function LeaderboardPreview() {
  const rows = getLeaderboard().slice(0, 6);

  return (
    <section id="leaderboard" className="scroll-mt-20 py-24">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <SectionHeader
              eyebrow="Live standings"
              title={<>Where do you <span className="text-gradient">stack up?</span></>}
              description="Every correct call moves you up. Exact scores rocket you toward the podium. Think you can hit the top spot?"
            />
            <ul className="mt-6 space-y-3 text-sm text-ink-muted">
              {[
                "Global all-time ranking",
                "Weekly resets — fresh shot every Monday",
                "Top winner of the week spotlight",
              ].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-neon-green" /> {t}
                </li>
              ))}
            </ul>
            <Button href="/leaderboard" variant="secondary" className="mt-8">
              See full leaderboard <ArrowRight className="h-4 w-4" />
            </Button>
          </Reveal>

          <Reveal delay={0.1}>
            <LeaderboardTable rows={rows} compact />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
