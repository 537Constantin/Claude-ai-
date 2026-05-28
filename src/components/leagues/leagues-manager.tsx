"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Crown, Plus, Users, UserPlus, Check } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { cn, inviteCode } from "@/lib/utils";
import type { PrivateLeague, Profile } from "@/lib/types";

const SEED_LEAGUES: PrivateLeague[] = [
  { id: "l1", name: "Office Champions League", code: "WORK24", ownerId: "user-you", memberCount: 12, createdAt: "" },
  { id: "l2", name: "Sunday Pub Predictors", code: "PUB777", ownerId: "user-1", memberCount: 8, createdAt: "" },
  { id: "l3", name: "Uni Squad", code: "CAMPUS", ownerId: "user-you", memberCount: 5, createdAt: "" },
];

export function LeaguesManager({ friends }: { friends: Profile[] }) {
  const [leagues, setLeagues] = useState<PrivateLeague[]>(SEED_LEAGUES);
  const [name, setName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  function createLeague() {
    const trimmed = name.trim();
    if (!trimmed) return;
    setLeagues((prev) => [
      {
        id: `l-${Date.now()}`,
        name: trimmed,
        code: inviteCode(),
        ownerId: "user-you",
        memberCount: 1,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
    setName("");
  }

  function joinLeague() {
    const code = joinCode.trim().toUpperCase();
    if (code.length < 4 || leagues.some((l) => l.code === code)) {
      setJoinCode("");
      return;
    }
    setLeagues((prev) => [
      {
        id: `l-${Date.now()}`,
        name: `League ${code}`,
        code,
        ownerId: "someone",
        memberCount: 2,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
    setJoinCode("");
  }

  async function copyCode(code: string) {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      /* clipboard may be unavailable — non-critical */
    }
    setCopied(code);
    setTimeout(() => setCopied(null), 1500);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {/* Leagues list */}
      <div className="space-y-4 lg:col-span-2">
        <h2 className="font-display text-xl font-bold tracking-tight">
          Your private leagues
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {leagues.map((league) => (
              <motion.div
                key={league.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
              >
                <GlassCard interactive className="space-y-4 p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-display text-lg font-bold leading-tight">
                        {league.name}
                      </p>
                      <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-subtle">
                        <Users className="h-3.5 w-3.5" /> {league.memberCount}{" "}
                        members
                      </p>
                    </div>
                    {league.ownerId === "user-you" && (
                      <Badge tone="amber">
                        <Crown className="h-3 w-3" /> Owner
                      </Badge>
                    )}
                  </div>
                  <button
                    onClick={() => copyCode(league.code)}
                    className="flex w-full items-center justify-between rounded-lg border border-dashed border-line px-3 py-2 text-sm transition hover:border-neon-green/40"
                  >
                    <span className="font-mono tracking-widest text-ink-muted">
                      {league.code}
                    </span>
                    {copied === league.code ? (
                      <Check className="h-4 w-4 text-neon-green" />
                    ) : (
                      <Copy className="h-4 w-4 text-ink-subtle" />
                    )}
                  </button>
                </GlassCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Create / join + friends */}
      <div className="space-y-6">
        <GlassCard strong className="space-y-4 p-5">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-neon-green/10 text-neon-green">
              <Plus className="h-5 w-5" />
            </span>
            <h3 className="font-semibold">Create a league</h3>
          </div>
          <Field
            placeholder="League name"
            value={name}
            onChange={setName}
            onEnter={createLeague}
          />
          <Button onClick={createLeague} className="w-full" disabled={!name.trim()}>
            Create league
          </Button>
        </GlassCard>

        <GlassCard className="space-y-4 p-5">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-neon-cyan/10 text-neon-cyan">
              <UserPlus className="h-5 w-5" />
            </span>
            <h3 className="font-semibold">Join with a code</h3>
          </div>
          <Field
            placeholder="INVITE CODE"
            value={joinCode}
            onChange={(v) => setJoinCode(v.toUpperCase())}
            onEnter={joinLeague}
            mono
          />
          <Button
            onClick={joinLeague}
            variant="secondary"
            className="w-full"
            disabled={joinCode.trim().length < 4}
          >
            Join league
          </Button>
        </GlassCard>

        <GlassCard className="space-y-3 p-5">
          <h3 className="font-semibold">Friends</h3>
          <ul className="space-y-2">
            {friends.map((f) => (
              <li key={f.id} className="flex items-center gap-3">
                <Avatar value={f.avatar} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{f.username}</p>
                  <p className="text-xs text-ink-subtle">{f.totalPoints} pts</p>
                </div>
                <Badge tone="green" className="shrink-0">
                  Friends
                </Badge>
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>
    </div>
  );
}

function Field({
  value,
  onChange,
  placeholder,
  onEnter,
  mono,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  onEnter: () => void;
  mono?: boolean;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && onEnter()}
      placeholder={placeholder}
      className={cn(
        "w-full rounded-xl border border-line bg-white/[0.02] px-3.5 py-2.5 text-sm outline-none transition placeholder:text-ink-subtle focus:border-neon-green/50 focus:ring-2 focus:ring-neon-green/20",
        mono && "font-mono tracking-widest"
      )}
    />
  );
}
