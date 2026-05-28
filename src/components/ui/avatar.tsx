import { cn } from "@/lib/utils";

interface AvatarProps {
  /** Emoji or single character. (Image avatars can be added later.) */
  value: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  ring?: boolean;
}

const sizes = {
  sm: "h-8 w-8 text-base",
  md: "h-11 w-11 text-xl",
  lg: "h-16 w-16 text-3xl",
};

export function Avatar({ value, size = "md", className, ring }: AvatarProps) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-surface-elevated",
        ring && "ring-2 ring-neon-green/40",
        sizes[size],
        className
      )}
      aria-hidden
    >
      {value}
    </span>
  );
}
