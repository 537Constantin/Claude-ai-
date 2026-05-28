import type { Metadata } from "next";
import Link from "next/link";
import {
  Flame,
  Target,
  TrendingUp,
  Trophy,
  ArrowRight,
  Star,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { MatchCard } from "@/components/matches/match-card";
import { LeaderboardTable } from "@/components/leaderboard/leaderboard-table";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import {
  getCurrentProfile,
  getLeaderboard,
  getUpcomingMatches,
  getUserPredictions,
  getUserStats,
} from "@/lib/data";
import { LEAGUES } from "@/lib/constants";
import { ordinal } from "@/lib/utils";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
  const profile = getCurrentProfile();
  const stats = getUserStats();
  const upcoming = getUpcomingMatches(2);
  const predictions = getUserPredictions().slice(0, 4);
  const leaderboard = getLeaderboard().slice(0, 5);
  const favLeague = stats.favoriteLeague ? LEAGUES[stats.favoriteLeague] : null;

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <Reveal className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-ink-muted">Welcome back,</p>
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {profile.username} {profile.avatar}
          </h1>
        </div>
        <Badge tone="green" className="px-3 py-1">
          <Trophy className="h-3.5 w-3.5" /> Rank {ordinal(stats.rank)} globally
        </Badge>
      </Reveal>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total points" value={stats.totalPoints} icon={Trophy} tone="green" hint={`${stats.predictionCount} predictions made`} />
        <StatCard label="This week" value={`+${stats.weeklyPoints}`} icon={Flame} tone="amber" hint="Resets every Monday" />
        <StatCard label="Win rate" value={`${stats.winRate}%`} icon={TrendingUp} tone="cyan" hint={`${stats.correctCount} correct results`} />
        <StatCard label="Exact scores" value={stats.exactCount} icon={Target} tone="violet" hint={`${stats.exactRate}% of tips`} />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left: matches + predictions */}
        <div className="space-y-8 lg:col-span-2">
          <section className="space-y-4">
            <SectionTitle title="Next up" href="/matches" label="All matches" />
            <div className="grid gap-4 sm:grid-cols-2">
              {upcoming.map((m) => (
                <MatchCard key={m.id} match={m} />
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <SectionTitle title="Recent tips" href="/profile" label="View profile" />
            <GlassCard className="divide-y divide-line/50">
              {predictions.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between gap-3 px-4 py-3 text-sm"
                >
                  <span className="flex items-center gap-2">
                    <span>{m.homeTeam.crest}</span>
                    <span className="font-medium">
                      {m.homeTeam.tla} vs {m.awayTeam.tla}
                    </span>
                    <span>{m.awayTeam.crest}</span>
                  </span>
                  <span className="flex items-center gap-3">
                    <span className="text-ink-muted">
                      {m.prediction?.homeScore}–{m.prediction?.awayScore}
                    </span>
                    {m.prediction?.pointsAwarded != null ? (
                      <Badge
                        tone={
                          m.prediction.pointsAwarded >= 5
                            ? "cyan"
                            : m.prediction.pointsAwarded >= 3
                              ? "green"
                              : "neutral"
                        }
                      >
                        +{m.prediction.pointsAwarded}
                      </Badge>
                    ) : (
                      <Badge tone="amber">pending</Badge>
                    )}
                  </span>
                </div>
              ))}
            </GlassCard>
          </section>
        </div>

        {/* Right: leaderboard + favourite league */}
        <div className="space-y-8">
          <section className="space-y-4">
            <SectionTitle title="Top players" href="/leaderboard" label="Full board" />
            <LeaderboardTable rows={leaderboard} compact />
          </section>

          {favLeague && (
            <GlassCard className="space-y-3 p-5">
              <div className="flex items-center gap-2 text-sm text-ink-muted">
                <Star className="h-4 w-4 text-amber-400" /> Favourite league
              </div>
              <p className="font-display text-2xl font-bold">{favLeague.name}</p>
              <p className="text-sm text-ink-muted">{favLeague.country}</p>
              <Button href="/matches" variant="secondary" size="sm" className="w-full">
                Tip {favLeague.name}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
}

function SectionTitle({
  title,
  href,
  label,
}: {
  title: string;
  href: string;
  label: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="font-display text-xl font-bold tracking-tight">{title}</h2>
      <Link
        href={href}
        className="inline-flex items-center gap-1 text-sm font-medium text-neon-green hover:underline"
      >
        {label} <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
