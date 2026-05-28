import { Container, SectionHeader } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { POINTS } from "@/lib/constants";

const STEPS = [
  {
    step: "01",
    title: "Pick your matches",
    desc: "Browse every Bundesliga & Premier League fixture and tap the ones you want to tip.",
  },
  {
    step: "02",
    title: "Make your call",
    desc: `Predict the winner for +${POINTS.CORRECT_OUTCOME} points, or the exact score for a full +${POINTS.EXACT_SCORE}.`,
  },
  {
    step: "03",
    title: "Climb the board",
    desc: "Points are scored automatically after full-time. Watch your rank rise in real time.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-20 py-24">
      <Container>
        <Reveal>
          <SectionHeader
            align="center"
            eyebrow="How it works"
            title="Three taps to glory"
            description="No spreadsheets, no maths. Just tip, sit back, and let the points roll in."
          />
        </Reveal>

        <div className="relative mt-14 grid gap-6 md:grid-cols-3">
          {/* connecting line */}
          <div className="pointer-events-none absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-transparent via-neon-green/40 to-transparent md:block" />
          {STEPS.map((s, i) => (
            <Reveal key={s.step} delay={i * 0.1}>
              <div className="relative flex flex-col items-center text-center">
                <span className="grid h-16 w-16 place-items-center rounded-2xl glass-strong font-display text-xl font-bold text-neon-green shadow-glow">
                  {s.step}
                </span>
                <h3 className="mt-5 font-display text-lg font-bold">{s.title}</h3>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-ink-muted">
                  {s.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
