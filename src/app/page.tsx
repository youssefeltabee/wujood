import type { Metadata } from "next";
import { HeroSection } from "@/components/landing/HeroSection";
import { StatsSection } from "@/components/landing/StatsSection";
import { FinalCTASection } from "@/components/landing/FinalCTASection";
import { Navigation } from "@/components/navigation/Navigation";

export const metadata: Metadata = {
  title: "Home",
  description: "Website builder, WhatsApp CRM, social media tools, and AI chatbot for Egyptian SMEs. All in EGP, all in Arabic.",
};

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