import { Badge } from "@/components/ui/badge";
import { LEAGUES } from "@/lib/constants";
import type { LeagueCode } from "@/lib/types";

export function LeagueBadge({ code }: { code: LeagueCode }) {
  const league = LEAGUES[code];
  return (
    <Badge tone={code === "BL1" ? "red" : "violet"} className="font-semibold">
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: league.accent }}
      />
      {league.tag}
    </Badge>
  );
}
