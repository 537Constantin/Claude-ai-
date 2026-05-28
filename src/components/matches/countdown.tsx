"use client";

import { useCountdown } from "@/hooks/use-countdown";
import { cn } from "@/lib/utils";

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

interface CountdownProps {
  kickoff: string;
  className?: string;
  /** Compact single-line variant for tight cards. */
  compact?: boolean;
}

export function Countdown({ kickoff, className, compact }: CountdownProps) {
  const c = useCountdown(kickoff);

  // Pre-hydration placeholder keeps layout stable.
  if (!c) {
    return (
      <span className={cn("font-mono text-sm text-ink-subtle", className)}>
        --:--:--
      </span>
    );
  }

  if (c.isLive) {
    return (
      <span className={cn("text-sm font-medium text-neon-green", className)}>
        Kicking off
      </span>
    );
  }

  if (compact) {
    const label =
      c.days > 0
        ? `${c.days}d ${pad(c.hours)}h`
        : `${pad(c.hours)}:${pad(c.minutes)}:${pad(c.seconds)}`;
    return (
      <span className={cn("font-mono text-sm tabular-nums", className)}>
        {label}
      </span>
    );
  }

  const units: [string, number][] = [
    ["Days", c.days],
    ["Hrs", c.hours],
    ["Min", c.minutes],
    ["Sec", c.seconds],
  ];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {units.map(([label, value]) => (
        <div
          key={label}
          className="flex min-w-[3rem] flex-col items-center rounded-lg bg-white/5 px-2 py-1.5"
        >
          <span className="font-mono text-lg font-semibold tabular-nums text-ink">
            {pad(value)}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-ink-subtle">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
