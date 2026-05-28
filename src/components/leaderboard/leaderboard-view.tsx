"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Flame, Globe } from "lucide-react";
import { Podium } from "./podium";
import { LeaderboardTable } from "./leaderboard-table";
import { GlassCard } from "@/components/ui/glass-card";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { LeaderboardRow } from "@/lib/types";

type Tab = "global" | "weekly";

export function LeaderboardView({
  global,
  weekly,
}: {
  global: LeaderboardRow[];
  weekly: LeaderboardRow[];
}) {
  const [tab, setTab] = useState<Tab>("global");
  const rows = tab === "global" ? global : weekly;
  const metric = tab === "global" ? "totalPoints" : "weeklyPoints";

  const winnerOfWeek = useMemo(() => weekly[0], [weekly]);

  return (
    <div className="space-y-8">
      {/* Tabs */}
      <div className="flex justify-center">
        <div className="inline-flex gap-1 rounded-xl bg-white/[0.03] p-1">
          <TabButton active={tab === "global"} onClick={() => setTab("global")}>
            <Globe className="h-4 w-4" /> Global
          </TabButton>
          <TabButton active={tab === "weekly"} onClick={() => setTab("weekly")}>
            <Flame className="h-4 w-4" /> This week
          </TabButton>
        </div>
      </div>

      {/* Top winner of the week banner */}
      {tab === "weekly" && winnerOfWeek && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <GlassCard
            strong
            className="flex items-center justify-between gap-4 p-5 neon-ring"
          >
            <div className="flex items-center gap-4">
              <Avatar value={winnerOfWeek.profile.avatar} size="lg" ring />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-neon-green">
                  Top winner of the week
                </p>
                <p className="font-display text-2xl font-bold">
                  {winnerOfWeek.profile.username}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-display text-3xl font-bold text-neon-green">
                +{winnerOfWeek.profile.weeklyPoints}
              </p>
              <p className="text-xs text-ink-subtle">points this week</p>
            </div>
          </GlassCard>
        </motion.div>
      )}

      <Podium rows={rows} metric={metric} />
      <LeaderboardTable rows={rows} metric={metric} />
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
        active ? "text-zinc-950" : "text-ink-muted hover:text-ink"
      )}
    >
      {active && (
        <motion.span
          layoutId="lb-tab"
          className="absolute inset-0 rounded-lg bg-neon-green"
          transition={{ type: "spring", stiffness: 400, damping: 32 }}
        />
      )}
      <span className="relative inline-flex items-center gap-2">{children}</span>
    </button>
  );
}
