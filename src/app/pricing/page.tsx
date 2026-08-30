import type { Metadata } from "next";
import { PricingSection } from "@/components/landing/PricingSection";
import { Navigation } from "@/components/navigation/Navigation";
import { PageHero } from "@/components/landing/PageHero";

export const metadata: Metadata = {
  title: "Pricing | Wujood",
  description:
    "Transparent Wujood pricing for Egyptian SMEs from 1,250 EGP/month. All plans include a 14-day free trial, no credit card required, cancel anytime, export data.",
  openGraph: {
    title: "Pricing | Wujood",
    description:
      "Transparent Wujood pricing for Egyptian SMEs from 1,250 EGP/month. All plans include a 14-day free trial, no credit card required, cancel anytime, export data.",
  },
};

const assurances = [
  {
    title: "14-Day Free Trial",
    body: "Full access to all features. No credit card required.",
    icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
    color: "accent-gold" as const,
  },
  {
    title: "Secure & Compliant",
    body: "Bank-grade encryption. GDPR & PDPL compliant.",
    icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
    color: "accent-cyan" as const,
  },
  {
    title: "Cancel Anytime",
    body: "No long-term contracts. Export your data anytime.",
    icon: "M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z",
    color: "green-500" as const,
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <Navigation />
      <main className="pt-[var(--spacing-nav-height)]">
        <PageHero
          eyebrow="Pricing"
          title="Simple, Transparent Pricing"
          subtitle="Choose the plan that fits your business. All plans include a 14-day free trial."
        />
        <PricingSection />
        <section className="pb-[var(--spacing-section)] px-6">
          <div className="max-w-[80rem] mx-auto">
            <div className="grid md:grid-cols-3 gap-6 text-center animate-stagger">
              {assurances.map((a) => (
                <div key={a.title} className="card-lux p-8">
                  <div className={`w-12 h-12 mx-auto mb-4 bg-${a.color}/10 rounded-xl flex items-center justify-center`}>
                    <svg className={`w-6 h-6 text-${a.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={a.icon} />
                    </svg>
                  </div>
                  <h3 className="text-xl font-heading font-semibold text-text-primary mb-2">{a.title}</h3>
                  <p className="text-text-secondary">{a.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
