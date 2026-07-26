import { HeroSection } from "@/components/landing/HeroSection";
import { StatsSection } from "@/components/landing/StatsSection";
import { FinalCTASection } from "@/components/landing/FinalCTASection";
import { Navigation } from "@/components/navigation/Navigation";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <Navigation />
      <main className="pt-[var(--spacing-nav-height)]">
        <HeroSection />
        <StatsSection />
        <FinalCTASection />
      </main>
    </div>
  );
}