import type { Metadata } from "next";
import { ProblemSection } from "@/components/landing/ProblemSection";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { FAASection } from "@/components/landing/FAASection";
import { Navigation } from "@/components/navigation/Navigation";
import { PageHero } from "@/components/landing/PageHero";

export const metadata: Metadata = {
  title: "Features",
  description: "Everything you need to build trust online — website builder, WhatsApp CRM, social media tools, and AI chatbot for Egyptian SMEs.",
};

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <Navigation />
      <main className="pt-[var(--spacing-nav-height)]">
        <PageHero
          eyebrow="Features"
          title="Everything You Need to Build Trust Online"
          subtitle="From automated audits to social proof — Wujood gives you the complete toolkit to turn visitors into customers."
        />
        <ProblemSection />
        <HowItWorks />
        <FAASection />
      </main>
    </div>
  );
}
