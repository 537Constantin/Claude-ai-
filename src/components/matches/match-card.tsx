"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Trophy } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { LeagueBadge } from "./league-badge";
import { TeamCrest } from "./team-crest";
import { LiveBadge } from "./live-badge";
import { Countdown } from "./countdown";
import { PredictionPicker } from "./prediction-picker";
import { cn, formatKickoff, ordinal } from "@/lib/utils";
import { scoreLabel, scorePrediction } from "@/lib/scoring";
import type { MatchWithTeams, Outcome, Prediction } from "@/lib/types";

export function MatchCard({ match }: { match: MatchWithTeams }) {
  const [prediction, setPrediction] = useState<Prediction | null>(
    match.prediction ?? null
  );
  const { date, time } = formatKickoff(match.kickoff);

  function handleSubmit(p: {
    outcome: Outcome;
    homeScore: number;
    awayScore: number;
  }) {
    setPrediction({
      id: prediction?.id ?? `local-${match.id}`,
      matchId: match.id,
      userId: "user-you",
      outcome: p.outcome,
      homeScore: p.homeScore,
      awayScore: p.awayScore,
      createdAt: new Date().toISOString(),
      pointsAwarded: null,
    });
  }

  const finished = match.status === "finished";
  const live = match.status === "live";
  const showScore = (finished || live) && match.homeScore !== null;

  return (
    <GlassCard interactive className="flex flex-col overflow-hidden p-0">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-line/60 px-4 py-2.5">
        <LeagueBadge code={match.league} />
        <div className="flex items-center gap-2">
          {live && <LiveBadge minute={match.minute} />}
          {finished && (
            <Badge tone="neutral" className="font-semibold">
              FT
            </Badge>
          )}
          {match.status === "scheduled" && (
            <span className="text-xs text-ink-subtle">
              {date} · {time}
            </span>
          )}
        </div>
      </div>

      {/* Matchup */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 px-4 py-5">
        <TeamSide team={match.homeTeam} align="left" />

        <div className="flex min-w-[5.5rem] flex-col items-center gap-1">
          {showScore ? (
            <div
              className={cn(
                "font-display text-3xl font-bold tabular-nums",
                live && "text-neon-green"
              )}
            >
              {match.homeScore}
              <span className="mx-1 text-ink-subtle">:</span>
              {match.awayScore}
            </div>
          ) : (
            <span className="font-display text-xl font-semibold text-ink-subtle">
              VS
            </span>
          )}
          {match.status === "scheduled" && (
            <Countdown kickoff={match.kickoff} compact className="text-ink-muted" />
          )}
        </div>

        <TeamSide team={match.awayTeam} align="right" />
      </div>

      {/* Stadium */}
      <div className="flex items-center justify-center gap-1.5 px-4 pb-3 text-xs text-ink-subtle">
        <MapPin className="h-3.5 w-3.5" />
        {match.stadium} · Matchday {match.matchday}
      </div>

      {/* Footer: predict / result */}
      <div className="border-t border-line/60 bg-black/10 px-4 py-3.5">
        {match.status === "scheduled" ? (
          <PredictionPicker match={{ ...match, prediction }} onSubmit={handleSubmit} />
        ) : (
          <ResultRow match={match} prediction={prediction} />
        )}
      </div>
    </GlassCard>
  );
}

function TeamSide({
  team,
  align,
}: {
  team: MatchWithTeams["homeTeam"];
  align: "left" | "right";
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3",
        align === "right" && "flex-row-reverse text-right"
      )}
    >
      <TeamCrest team={team} />
      <div className={cn("min-w-0", align === "right" && "items-end")}>
        <p className="truncate font-semibold leading-tight">{team.shortName}</p>
        <p className="text-xs text-ink-subtle">{ordinal(team.position)}</p>
      </div>
    </div>
  );
}

function ResultRow({
  match,
  prediction,
}: {
  match: MatchWithTeams;
  prediction: Prediction | null;
}) {
  if (!prediction) {
    return (
      <p className="text-center text-sm text-ink-subtle">No tip placed</p>
    );
  }

  const live = match.status === "live";
  const points =
    !live && match.homeScore !== null && match.awayScore !== null
      ? scorePrediction({
          predicted: {
            outcome: prediction.outcome,
            homeScore: prediction.homeScore,
            awayScore: prediction.awayScore,
          },
          actual: { homeScore: match.homeScore, awayScore: match.awayScore },
        })
      : null;

  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-ink-muted">
        Your tip:{" "}
        <span className="font-semibold text-ink">
          {prediction.homeScore}–{prediction.awayScore}
        </span>
      </span>
      {live ? (
        <Badge tone="amber">In play</Badge>
      ) : points !== null ? (
        <motion.span
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <Badge tone={points >= 5 ? "cyan" : points >= 3 ? "green" : "neutral"}>
            <Trophy className="h-3 w-3" />
            {scoreLabel(points)} · +{points}
          </Badge>
        </motion.span>
      ) : null}
    </div>
  );
}
