import { cn } from "@/lib/utils";

type Tone = "neutral" | "green" | "cyan" | "violet" | "red" | "amber";

const tones: Record<Tone, string> = {
  neutral: "bg-white/5 text-ink-muted border-white/10",
  green: "bg-neon-green/10 text-neon-green border-neon-green/30",
  cyan: "bg-neon-cyan/10 text-neon-cyan border-neon-cyan/30",
  violet: "bg-neon-violet/10 text-neon-violet border-neon-violet/30",
  red: "bg-red-500/10 text-red-400 border-red-500/30",
  amber: "bg-amber-500/10 text-amber-400 border-amber-500/30",
};

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

export function Badge({ tone = "neutral", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium tracking-wide",
        tones[tone],
        className
      )}
      {...props}
    />
  );
}
