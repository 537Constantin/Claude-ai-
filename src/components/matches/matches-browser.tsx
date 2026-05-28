"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarClock } from "lucide-react";
import { MatchCard } from "./match-card";
import { LEAGUE_LIST } from "@/lib/constants";
import { cn, formatKickoff, groupBy } from "@/lib/utils";
import type { LeagueCode, MatchStatus, MatchWithTeams } from "@/lib/types";

type LeagueFilter = "ALL" | LeagueCode;
type StatusFilter = "all" | MatchStatus;

const STATUS_TABS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "live", label: "Live" },
  { value: "scheduled", label: "Upcoming" },
  { value: "finished", label: "Finished" },
];

export function MatchesBrowser({ matches }: { matches: MatchWithTeams[] }) {
  const [league, setLeague] = useState<LeagueFilter>("ALL");
  const [status, setStatus] = useState<StatusFilter>("all");

  const filtered = useMemo(
    () =>
      matches.filter(
        (m) =>
          (league === "ALL" || m.league === league) &&
          (status === "all" || m.status === status)
      ),
    [matches, league, status]
  );

  const liveCount = matches.filter((m) => m.status === "live").length;

  // Group upcoming/all by day for a calendar feel.
  const groups = useMemo(
    () =>
      groupBy(filtered, (m) => formatKickoff(m.kickoff).date),
    [filtered]
  );

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <Chip active={league === "ALL"} onClick={() => setLeague("ALL")}>
            All leagues
          </Chip>
          {LEAGUE_LIST.map((l) => (
            <Chip
              key={l.code}
              active={league === l.code}
              onClick={() => setLeague(l.code)}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: l.accent }}
              />
              {l.name}
            </Chip>
          ))}
        </div>

        <div className="flex gap-1 rounded-xl bg-white/[0.03] p-1">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatus(tab.value)}
              className={cn(
                "relative rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                status === tab.value
                  ? "text-zinc-950"
                  : "text-ink-muted hover:text-ink"
              )}
            >
              {status === tab.value && (
                <motion.span
                  layoutId="status-pill"
                  className="absolute inset-0 rounded-lg bg-neon-green"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <span className="relative inline-flex items-center gap-1.5">
                {tab.label}
                {tab.value === "live" && liveCount > 0 && (
                  <span className="grid h-4 min-w-4 place-items-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                    {liveCount}
                  </span>
                )}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Grouped grid */}
      <AnimatePresence mode="popLayout">
        {Object.keys(groups).length === 0 ? (
          <EmptyState />
        ) : (
          Object.entries(groups).map(([day, dayMatches]) => (
            <motion.section
              key={day}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              <h3 className="flex items-center gap-2 text-sm font-semibold text-ink-muted">
                <CalendarClock className="h-4 w-4" />
                {day}
              </h3>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {dayMatches.map((m) => (
                  <MatchCard key={m.id} match={m} />
                ))}
              </div>
            </motion.section>
          ))
        )}
      </AnimatePresence>
    </div>
  );
}

function Chip({
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
        "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all",
        active
          ? "border-neon-green/40 bg-neon-green/10 text-neon-green"
          : "border-line text-ink-muted hover:border-white/20 hover:text-ink"
      )}
    >
      {children}
    </button>
  );
}

function EmptyState() {
  return (
    <div className="grid place-items-center rounded-2xl border border-dashed border-line py-16 text-center">
      <p className="text-4xl">🏟️</p>
      <p className="mt-3 font-medium">No matches here</p>
      <p className="text-sm text-ink-subtle">Try a different filter.</p>
    </div>
  );
}
