import Link from "next/link";
import { cn } from "@/lib/utils";
import { SITE } from "@/lib/constants";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("group inline-flex items-center gap-2", className)}
    >
      <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-neon-green text-zinc-950 shadow-glow transition-transform group-hover:scale-105">
        <span className="text-lg font-black">⚽</span>
      </span>
      <span className="font-display text-lg font-bold tracking-tight">
        {SITE.name}
      </span>
    </Link>
  );
}
