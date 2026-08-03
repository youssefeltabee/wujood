import type { Metadata } from "next";
import { ProblemSection } from "@/components/landing/ProblemSection";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { FAASection } from "@/components/landing/FAASection";
import { Navigation } from "@/components/navigation/Navigation";

export const metadata: Metadata = {
  title: "Features",
  description: "Everything you need to build trust online — website builder, WhatsApp CRM, social media tools, and AI chatbot for Egyptian SMEs.",
};

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <Navigation />
      <main className="pt-[var(--spacing-nav-height)]">
        <section className="py-[var(--spacing-section)] px-6">
          <div className="max-w-[80rem] mx-auto text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-text-primary mb-6">
              Everything You Need to Build Trust Online
            </h1>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              From automated audits to social proof — Wujood gives you the complete toolkit to turn visitors into customers.
            </p>
          </div>
        </section>
        <ProblemSection />
        <HowItWorks />
        <FAASection />
      </main>
    </div>
  );
}