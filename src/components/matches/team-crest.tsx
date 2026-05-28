import { cn } from "@/lib/utils";
import type { Team } from "@/lib/types";

interface TeamCrestProps {
  team: Team;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: "h-9 w-9 text-lg",
  md: "h-12 w-12 text-2xl",
  lg: "h-16 w-16 text-3xl",
};

/** Gradient disc with the team's emoji crest — a clean stand-in for logos. */
export function TeamCrest({ team, size = "md", className }: TeamCrestProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-2xl bg-gradient-to-br shadow-inner ring-1 ring-white/10",
        team.color,
        sizes[size],
        className
      )}
      title={team.name}
      aria-label={team.name}
    >
      <span className="drop-shadow">{team.crest}</span>
    </span>
  );
}
