import Link from "next/link";
import { Logo } from "./logo";
import { Container } from "@/components/ui/section";
import { SITE } from "@/lib/constants";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Matches", href: "/matches" },
      { label: "Leaderboard", href: "/leaderboard" },
      { label: "Private leagues", href: "/leagues" },
      { label: "Dashboard", href: "/dashboard" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
      { label: "Fair play", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-line/60 bg-surface-muted/40">
      <Container className="py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Logo />
            <p className="max-w-xs text-sm leading-relaxed text-ink-muted">
              {SITE.description}
            </p>
            <p className="text-xs font-medium text-ink-subtle">
              No real money · No gambling · Just glory.
            </p>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold text-ink">{col.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-ink-muted transition-colors hover:text-neon-green"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-line/60 pt-6 text-xs text-ink-subtle sm:flex-row">
          <p>
            © {new Date().getFullYear()} {SITE.name}. Built for fun, not profit.
          </p>
          <p>Made with ⚽ for football fans worldwide.</p>
        </div>
      </Container>
    </footer>
  );
}
