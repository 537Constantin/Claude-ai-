import { MarketingHeader } from "@/components/landing/marketing-header";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { HowItWorks } from "@/components/landing/how-it-works";
import { LeaderboardPreview } from "@/components/landing/leaderboard-preview";
import { CTA } from "@/components/landing/cta";
import { Footer } from "@/components/layout/footer";

export default function LandingPage() {
  return (
    <>
      <MarketingHeader />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <LeaderboardPreview />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
