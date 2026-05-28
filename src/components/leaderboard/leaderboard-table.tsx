"use client";

import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, Minus } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { GlassCard } from "@/components/ui/glass-card";
import { cn, winRate } from "@/lib/utils";
import { DEMO_USER_ID } from "@/lib/mock-data";
import type { LeaderboardRow } from "@/lib/types";

interface LeaderboardTableProps {
  rows: LeaderboardRow[];
  metric?: "totalPoints" | "weeklyPoints";
  /** Hide the top-3 podium emphasis (e.g. when embedded). */
  compact?: boolean;
}

export function LeaderboardTable({
  rows,
  metric = "totalPoints",
  compact,
}: LeaderboardTableProps) {
  return (
    <GlassCard className="overflow-hidden">
      <div className="divide-y divide-line/50">
        {/* Header */}
        <div className="grid grid-cols-[2.5rem_1fr_auto] items-center gap-3 px-4 py-3 text-xs font-medium uppercase tracking-wider text-ink-subtle sm:grid-cols-[2.5rem_1fr_5rem_auto]">
          <span>#</span>
          <span>Player</span>
          <span className="hidden text-right sm:block">Win&nbsp;%</span>
          <span className="text-right">Points</span>
        </div>

        {rows.map((row, i) => {
          const isYou = row.profile.id === DEMO_USER_ID;
          const top3 = !compact && row.rank <= 3;
          return (
            <motion.div
              key={row.profile.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: Math.min(i * 0.03, 0.4) }}
              className={cn(
                "grid grid-cols-[2.5rem_1fr_auto] items-center gap-3 px-4 py-3 transition-colors hover:bg-white/[0.03] sm:grid-cols-[2.5rem_1fr_5rem_auto]",
                isYou && "bg-neon-green/[0.06]"
              )}
            >
              <RankCell rank={row.rank} movement={row.movement} top3={top3} />

              <div className="flex min-w-0 items-center gap-3">
                <Avatar value={row.profile.avatar} size="sm" ring={top3} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">
                    {row.profile.username}
                    {isYou && (
                      <span className="ml-1.5 text-xs font-medium text-neon-green">
                        you
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-ink-subtle">
                    {row.profile.exactCount} exact ·{" "}
                    {row.profile.predictionCount} tips
                  </p>
                </div>
              </div>

              <span className="hidden text-right text-sm tabular-nums text-ink-muted sm:block">
                {winRate(row.profile.correctCount, row.profile.predictionCount)}%
              </span>

              <span className="text-right font-display text-lg font-bold tabular-nums">
                {row.profile[metric]}
              </span>
            </motion.div>
          );
        })}
      </div>
    </GlassCard>
  );
}

function RankCell({
  rank,
  movement,
  top3,
}: {
  rank: number;
  movement: number;
  top3: boolean;
}) {
  const medal = ["🥇", "🥈", "🥉"][rank - 1];
  return (
    <div className="flex items-center gap-1">
      <span
        className={cn(
          "font-display text-sm font-bold tabular-nums",
          top3 ? "text-base" : "text-ink-muted"
        )}
      >
        {top3 ? medal : rank}
      </span>
      <MovementArrow value={movement} />
    </div>
  );
}

function MovementArrow({ value }: { value: number }) {
  if (value === 0)
    return <Minus className="h-3 w-3 text-ink-subtle/60" aria-label="No change" />;
  if (value > 0)
    return <ChevronUp className="h-3.5 w-3.5 text-neon-green" aria-label={`Up ${value}`} />;
  return <ChevronDown className="h-3.5 w-3.5 text-red-400" aria-label={`Down ${-value}`} />;
}
