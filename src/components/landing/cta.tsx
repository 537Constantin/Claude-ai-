import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section className="py-24">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-4xl border border-neon-green/20 bg-surface-muted/60 px-6 py-16 text-center sm:px-12">
            <div className="pointer-events-none absolute inset-0 -z-10">
              <div className="absolute left-1/2 top-0 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-neon-green/20 blur-[100px]" />
              <div className="absolute inset-0 bg-grid-faint [background-size:40px_40px] [mask-image:radial-gradient(ellipse_50%_60%_at_50%_50%,#000_40%,transparent_100%)]" />
            </div>
            <h2 className="mx-auto max-w-2xl font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
              Ready to prove you know football?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-ink-muted">
              Join thousands of fans tipping every weekend. It takes ten seconds
              to start — and it&apos;s free forever.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button href="/dashboard" size="lg">
                Create your free account <ArrowRight className="h-5 w-5" />
              </Button>
              <Button href="/matches" variant="outline" size="lg">
                Explore matches
              </Button>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
