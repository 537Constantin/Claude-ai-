"use client";

import { motion } from "framer-motion";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { LeaderboardRow } from "@/lib/types";

/** Top-3 podium with a staged entrance. */
export function Podium({
  rows,
  metric = "totalPoints",
}: {
  rows: LeaderboardRow[];
  metric?: "totalPoints" | "weeklyPoints";
}) {
  const [first, second, third] = rows;
  // Visual order: 2nd, 1st, 3rd
  const ordered = [
    { row: second, place: 2, h: "h-24", delay: 0.1 },
    { row: first, place: 1, h: "h-32", delay: 0 },
    { row: third, place: 3, h: "h-20", delay: 0.2 },
  ].filter((x) => x.row);

  const accents: Record<number, string> = {
    1: "from-amber-300/30 to-amber-500/5 border-amber-400/40",
    2: "from-zinc-300/20 to-zinc-500/5 border-zinc-300/30",
    3: "from-orange-400/20 to-orange-600/5 border-orange-500/30",
  };
  const medals: Record<number, string> = { 1: "🥇", 2: "🥈", 3: "🥉" };

  return (
    <div className="flex items-end justify-center gap-3 sm:gap-6">
      {ordered.map(({ row, place, h, delay }) => (
        <motion.div
          key={row.profile.id}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex w-24 flex-col items-center sm:w-32"
        >
          <span className="mb-1 text-2xl">{medals[place]}</span>
          <Avatar
            value={row.profile.avatar}
            size={place === 1 ? "lg" : "md"}
            ring={place === 1}
            className={place === 1 ? "animate-float" : ""}
          />
          <p className="mt-2 max-w-full truncate text-sm font-semibold">
            {row.profile.username}
          </p>
          <p className="font-display text-lg font-bold text-neon-green">
            {row.profile[metric]}
          </p>
          <div
            className={cn(
              "mt-2 w-full rounded-t-xl border-t border-x bg-gradient-to-b",
              accents[place],
              h
            )}
          />
        </motion.div>
      ))}
    </div>
  );
}
