"use client";

import { useEffect, useState } from "react";

export interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number; // ms remaining
  isLive: boolean; // target in the past
}

function diff(target: number): Countdown {
  const total = Math.max(0, target - Date.now());
  return {
    total,
    days: Math.floor(total / 86_400_000),
    hours: Math.floor((total / 3_600_000) % 24),
    minutes: Math.floor((total / 60_000) % 60),
    seconds: Math.floor((total / 1000) % 60),
    isLive: total <= 0,
  };
}

/** Ticking countdown to an ISO timestamp. SSR-safe (starts after mount). */
export function useCountdown(iso: string): Countdown | null {
  const target = new Date(iso).getTime();
  const [state, setState] = useState<Countdown | null>(null);

  useEffect(() => {
    setState(diff(target));
    const id = setInterval(() => setState(diff(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  return state;
}
