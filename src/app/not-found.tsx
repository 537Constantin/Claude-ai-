import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden px-4 text-center">
      <div className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-neon-green/15 blur-[120px]" />
      <div className="space-y-6">
        <p className="text-7xl">🥅</p>
        <div className="space-y-2">
          <h1 className="font-display text-5xl font-extrabold">404</h1>
          <p className="text-ink-muted">
            This shot went wide. The page you&apos;re after doesn&apos;t exist.
          </p>
        </div>
        <div className="flex justify-center gap-3">
          <Button href="/">Back home</Button>
          <Button href="/matches" variant="secondary">
            See matches
          </Button>
        </div>
      </div>
    </div>
  );
}
