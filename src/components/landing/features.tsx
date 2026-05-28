import {
  Trophy,
  Target,
  Users,
  Zap,
  Bell,
  Smartphone,
  TrendingUp,
  ShieldCheck,
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Container, SectionHeader } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

const FEATURES = [
  { icon: Target, title: "Exact-score tips", desc: "Call the winner for 3 points or nail the exact scoreline for a full 5.", tone: "text-neon-green" },
  { icon: Zap, title: "Live match feeling", desc: "Real-time countdowns, live status badges and ticking scorelines.", tone: "text-neon-cyan" },
  { icon: Trophy, title: "Global & weekly ranks", desc: "Compete on the all-time board or chase the weekly winner crown.", tone: "text-amber-400" },
  { icon: Users, title: "Private leagues", desc: "Spin up a league, share a code and out-predict your friends.", tone: "text-neon-violet" },
  { icon: TrendingUp, title: "Deep stats", desc: "Track win rate, exact-score ratio and your favourite league.", tone: "text-neon-green" },
  { icon: Bell, title: "Smart reminders", desc: "Never miss kickoff with push notifications before deadlines.", tone: "text-neon-cyan" },
  { icon: Smartphone, title: "Mobile-first", desc: "A buttery-smooth experience on phone, tablet and desktop.", tone: "text-amber-400" },
  { icon: ShieldCheck, title: "No real money", desc: "100% free, no gambling, no catch. Just football and bragging rights.", tone: "text-neon-violet" },
];

export function Features() {
  return (
    <section id="features" className="scroll-mt-20 py-24">
      <Container>
        <Reveal>
          <SectionHeader
            align="center"
            eyebrow="Why KickOff"
            title={<>Everything you need to <span className="text-gradient">out-tip everyone</span></>}
            description="A premium prediction experience built for football fans who take their hot takes seriously."
          />
        </Reveal>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={(i % 4) * 0.06}>
              <GlassCard interactive className="h-full p-6">
                <span className={`inline-grid h-11 w-11 place-items-center rounded-xl bg-white/5 ${f.tone}`}>
                  <f.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-semibold">{f.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
                  {f.desc}
                </p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
