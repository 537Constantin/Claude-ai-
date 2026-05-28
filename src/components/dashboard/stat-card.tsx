import type { LucideIcon } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
  tone?: "green" | "cyan" | "violet" | "amber";
}

const toneMap = {
  green: "text-neon-green bg-neon-green/10",
  cyan: "text-neon-cyan bg-neon-cyan/10",
  violet: "text-neon-violet bg-neon-violet/10",
  amber: "text-amber-400 bg-amber-500/10",
};

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "green",
}: StatCardProps) {
  return (
    <GlassCard interactive className="p-5">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-ink-muted">{label}</p>
          <p className="font-display text-3xl font-bold tracking-tight">
            {value}
          </p>
        </div>
        <span
          className={cn(
            "grid h-10 w-10 place-items-center rounded-xl",
            toneMap[tone]
          )}
        >
          <Icon className="h-5 w-5" />
        </span>
      </div>
      {hint && <p className="mt-3 text-xs text-ink-subtle">{hint}</p>}
    </GlassCard>
  );
}
