import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Stronger blur + slightly brighter surface. */
  strong?: boolean;
  /** Add hover lift + neon border glow. */
  interactive?: boolean;
}

export function GlassCard({
  strong,
  interactive,
  className,
  children,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl shadow-card",
        strong ? "glass-strong" : "glass",
        interactive &&
          "transition-all duration-300 hover:-translate-y-1 hover:border-neon-green/30 hover:shadow-glow",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
