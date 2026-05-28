"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

/** Top navigation for the authenticated app shell. */
export function Navbar({
  user,
}: {
  user?: { username: string; avatar: string; totalPoints: number };
}) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-line/60 bg-surface/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Logo />
          <nav className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    active ? "text-ink" : "text-ink-muted hover:text-ink"
                  )}
                >
                  {link.label}
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-x-2 -bottom-[1px] h-0.5 rounded-full bg-neon-green"
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <Link
              href="/profile"
              className="flex items-center gap-2 rounded-full border border-line py-1 pl-1 pr-3 transition hover:border-neon-green/40"
            >
              <Avatar value={user.avatar} size="sm" ring />
              <span className="hidden text-sm sm:block">
                <span className="font-semibold">{user.totalPoints}</span>
                <span className="ml-1 text-ink-subtle">pts</span>
              </span>
            </Link>
          ) : (
            <Button href="/login" size="sm">
              Sign in
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
