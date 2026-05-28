import type { Metadata } from "next";
import { CalendarDays, Target, TrendingUp, Trophy } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import { StatCard } from "@/components/dashboard/stat-card";
import { LeagueBadge } from "@/components/matches/league-badge";
import {
  getCurrentProfile,
  getUserPredictions,
  getUserStats,
} from "@/lib/data";
import { ordinal } from "@/lib/utils";

export const metadata: Metadata = { title: "Profile" };

export default function ProfilePage() {
  const profile = getCurrentProfile();
  const stats = getUserStats();
  const predictions = getUserPredictions();
  const joined = new Date(profile.joinedAt).toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-8">
      {/* Header card */}
      <Reveal>
        <GlassCard strong className="overflow-hidden">
          <div className="h-24 bg-gradient-to-r from-neon-green/20 via-neon-cyan/15 to-neon-violet/20" />
          <div className="flex flex-col gap-4 px-6 pb-6 sm:flex-row sm:items-end">
            <div className="-mt-10">
              <Avatar value={profile.avatar} size="lg" ring className="h-20 w-20 text-4xl" />
            </div>
            <div className="flex-1">
              <h1 className="font-display text-2xl font-bold">
                {profile.username}
              </h1>
              <p className="flex items-center gap-1.5 text-sm text-ink-subtle">
                <CalendarDays className="h-3.5 w-3.5" /> Joined {joined}
              </p>
            </div>
            <div className="flex gap-2">
              <Badge tone="green">
                <Trophy className="h-3.5 w-3.5" /> {ordinal(stats.rank)} place
              </Badge>
              {stats.favoriteLeague && (
                <LeagueBadge code={stats.favoriteLeague} />
              )}
            </div>
          </div>
        </GlassCard>
      </Reveal>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total points" value={stats.totalPoints} icon={Trophy} tone="green" />
        <StatCard label="Win rate" value={`${stats.winRate}%`} icon={TrendingUp} tone="cyan" />
        <StatCard label="Exact scores" value={stats.exactCount} icon={Target} tone="violet" />
        <StatCard label="Predictions" value={stats.predictionCount} icon={CalendarDays} tone="amber" />
      </div>

      {/* History */}
      <section className="space-y-4">
        <h2 className="font-display text-xl font-bold tracking-tight">
          Prediction history
        </h2>
        <GlassCard className="divide-y divide-line/50">
          {predictions.map((m) => {
            const p = m.prediction!;
            const settled = p.pointsAwarded != null;
            return (
              <div
                key={m.id}
                className="flex items-center justify-between gap-3 px-4 py-3.5"
              >
                <div className="flex items-center gap-3">
                  <LeagueBadge code={m.league} />
                  <span className="text-sm font-medium">
                    {m.homeTeam.crest} {m.homeTeam.tla}
                    <span className="mx-1 text-ink-subtle">vs</span>
                    {m.awayTeam.tla} {m.awayTeam.crest}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-ink-muted">
                    tip{" "}
                    <span className="font-semibold text-ink">
                      {p.homeScore}–{p.awayScore}
                    </span>
                  </span>
                  {m.homeScore !== null && (
                    <span className="hidden text-ink-subtle sm:inline">
                      result {m.homeScore}–{m.awayScore}
                    </span>
                  )}
                  {settled ? (
                    <Badge
                      tone={
                        p.pointsAwarded! >= 5
                          ? "cyan"
                          : p.pointsAwarded! >= 3
                            ? "green"
                            : "neutral"
                      }
                    >
                      +{p.pointsAwarded}
                    </Badge>
                  ) : (
                    <Badge tone="amber">pending</Badge>
                  )}
                </div>
              </div>
            );
          })}
        </GlassCard>
      </section>
    </div>
  );
}
