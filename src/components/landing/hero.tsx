"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Trophy, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { TeamCrest } from "@/components/matches/team-crest";
import { LiveBadge } from "@/components/matches/live-badge";
import { getTeam } from "@/lib/mock-data";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  }),
};

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40">
      {/* Background grid + glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid-faint [background-size:48px_48px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_60%,transparent_100%)]" />
        <div className="absolute left-1/2 top-0 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-neon-green/20 blur-[120px]" />
        <div className="absolute right-0 top-40 h-[24rem] w-[24rem] rounded-full bg-neon-violet/15 blur-[120px]" />
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        {/* Copy */}
        <div>
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}>
            <Badge tone="green" className="mb-5 px-3 py-1">
              <Sparkles className="h-3.5 w-3.5" /> No real money · pure glory
            </Badge>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={1}
            className="font-display text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl"
          >
            Predict football.
            <br />
            <span className="text-gradient">Climb the ranks.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={2}
            className="mt-6 max-w-lg text-lg leading-relaxed text-ink-muted"
          >
            Tip every Bundesliga & Premier League match, call the exact scores,
            and battle friends on global and private leaderboards. Free forever.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={3}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Button href="/dashboard" size="lg">
              Start tipping <ArrowRight className="h-5 w-5" />
            </Button>
            <Button href="/matches" variant="secondary" size="lg">
              Browse matches
            </Button>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={4}
            className="mt-10 flex gap-8"
          >
            {[
              { value: "2", label: "Top leagues" },
              { value: "10k+", label: "Tips placed" },
              { value: "100%", label: "Free to play" },
            ].map((s) => (
              <div key={s.label}>
                <p className="font-display text-2xl font-bold">{s.value}</p>
                <p className="text-sm text-ink-subtle">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Floating preview */}
        <motion.div
          initial={{ opacity: 0, y: 40, rotateX: 8 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto w-full max-w-md [perspective:1200px]"
        >
          <div className="animate-float space-y-4">
            <PreviewMatchCard />
            <PreviewRankCard />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function PreviewMatchCard() {
  const home = getTeam("bl-fcb");
  const away = getTeam("bl-bvb");
  return (
    <GlassCard strong className="p-5 shadow-glow">
      <div className="mb-4 flex items-center justify-between">
        <Badge tone="red" className="font-semibold">BUNDESLIGA</Badge>
        <LiveBadge minute={67} />
      </div>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        <div className="flex flex-col items-center gap-2">
          <TeamCrest team={home} size="lg" />
          <span className="text-sm font-semibold">{home.tla}</span>
        </div>
        <div className="text-center">
          <p className="font-display text-4xl font-bold text-neon-green">2:1</p>
        </div>
        <div className="flex flex-col items-center gap-2">
          <TeamCrest team={away} size="lg" />
          <span className="text-sm font-semibold">{away.tla}</span>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between rounded-xl bg-neon-green/10 px-3 py-2 text-sm">
        <span className="text-ink-muted">Your tip 2–1</span>
        <Badge tone="cyan"><Trophy className="h-3 w-3" /> Perfect · +5</Badge>
      </div>
    </GlassCard>
  );
}

function PreviewRankCard() {
  return (
    <GlassCard className="flex items-center justify-between p-4 shadow-glow-cyan">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-neon-cyan/10 text-neon-cyan">
          <Zap className="h-5 w-5" />
        </span>
        <div>
          <p className="text-sm text-ink-muted">Weekly rank</p>
          <p className="font-display text-xl font-bold">#3 · +38 pts</p>
        </div>
      </div>
      <span className="text-2xl">📈</span>
    </GlassCard>
  );
}
