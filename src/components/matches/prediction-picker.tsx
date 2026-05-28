"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { POINTS } from "@/lib/constants";
import { outcomeFromScore } from "@/lib/scoring";
import type { MatchWithTeams, Outcome } from "@/lib/types";

interface PredictionPickerProps {
  match: MatchWithTeams;
  onSubmit?: (p: { outcome: Outcome; homeScore: number; awayScore: number }) => void;
}

const OUTCOME_LABELS: Record<Outcome, string> = {
  HOME: "1",
  DRAW: "X",
  AWAY: "2",
};

export function PredictionPicker({ match, onSubmit }: PredictionPickerProps) {
  const existing = match.prediction;
  const [outcome, setOutcome] = useState<Outcome | null>(existing?.outcome ?? null);
  const [home, setHome] = useState(existing?.homeScore ?? 0);
  const [away, setAway] = useState(existing?.awayScore ?? 0);
  const [saved, setSaved] = useState(false);

  // Keep the outcome in sync when the user edits the exact score.
  function setScore(side: "home" | "away", value: number) {
    const v = Math.max(0, Math.min(15, value));
    const nextHome = side === "home" ? v : home;
    const nextAway = side === "away" ? v : away;
    if (side === "home") setHome(v);
    else setAway(v);
    setOutcome(outcomeFromScore(nextHome, nextAway));
    setSaved(false);
  }

  function pick(o: Outcome) {
    setOutcome(o);
    setSaved(false);
  }

  function submit() {
    if (!outcome) return;
    onSubmit?.({ outcome, homeScore: home, awayScore: away });
    setSaved(true);
  }

  const isExact = outcome === outcomeFromScore(home, away) && (home > 0 || away > 0 || outcome === "DRAW");

  return (
    <div className="space-y-3">
      {/* 1 / X / 2 selector */}
      <div className="grid grid-cols-3 gap-2">
        {(Object.keys(OUTCOME_LABELS) as Outcome[]).map((o) => {
          const active = outcome === o;
          const label =
            o === "HOME"
              ? match.homeTeam.tla
              : o === "AWAY"
                ? match.awayTeam.tla
                : "Draw";
          return (
            <button
              key={o}
              onClick={() => pick(o)}
              className={cn(
                "group relative flex flex-col items-center gap-0.5 rounded-xl border px-2 py-2.5 text-sm font-semibold transition-all",
                active
                  ? "border-neon-green/50 bg-neon-green/10 text-neon-green shadow-glow"
                  : "border-line bg-white/[0.02] text-ink-muted hover:border-white/20 hover:text-ink"
              )}
            >
              <span className="text-lg leading-none">{OUTCOME_LABELS[o]}</span>
              <span className="text-[11px] font-medium opacity-80">{label}</span>
            </button>
          );
        })}
      </div>

      {/* Exact score steppers */}
      <div className="flex items-center justify-center gap-4 rounded-xl bg-white/[0.02] py-2.5">
        <Stepper
          label={match.homeTeam.tla}
          value={home}
          onChange={(v) => setScore("home", v)}
        />
        <span className="font-display text-xl text-ink-subtle">:</span>
        <Stepper
          label={match.awayTeam.tla}
          value={away}
          onChange={(v) => setScore("away", v)}
        />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-ink-subtle">
          {isExact ? (
            <span className="text-neon-cyan">Exact tip · up to +{POINTS.EXACT_SCORE} pts</span>
          ) : (
            <>Winner tip · +{POINTS.CORRECT_OUTCOME} pts</>
          )}
        </span>
        <button
          onClick={submit}
          disabled={!outcome}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-sm font-semibold transition-all active:scale-95 disabled:opacity-40",
            saved
              ? "bg-neon-green/15 text-neon-green"
              : "bg-neon-green text-zinc-950 hover:brightness-105"
          )}
        >
          <AnimatePresence mode="wait" initial={false}>
            {saved ? (
              <motion.span
                key="saved"
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="inline-flex items-center gap-1.5"
              >
                <Check className="h-4 w-4" /> Saved
              </motion.span>
            ) : (
              <motion.span key="save" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {existing ? "Update tip" : "Save tip"}
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </div>
  );
}

function Stepper({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-[10px] font-medium uppercase tracking-wider text-ink-subtle">
        {label}
      </span>
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onChange(value - 1)}
          className="grid h-7 w-7 place-items-center rounded-lg bg-white/5 text-ink-muted transition hover:bg-white/10 hover:text-ink active:scale-90"
          aria-label={`Decrease ${label} score`}
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
        <span className="w-7 text-center font-display text-xl font-bold tabular-nums">
          {value}
        </span>
        <button
          onClick={() => onChange(value + 1)}
          className="grid h-7 w-7 place-items-center rounded-lg bg-white/5 text-ink-muted transition hover:bg-white/10 hover:text-ink active:scale-90"
          aria-label={`Increase ${label} score`}
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
