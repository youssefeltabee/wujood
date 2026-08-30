import type { Metadata } from "next";
import { Navigation } from "@/components/navigation/Navigation";
import { PageHero } from "@/components/landing/PageHero";

export const metadata: Metadata = {
  title: "About | Wujood",
  description:
    "Learn how Wujood helps Egyptian businesses build trust online. Arabic-first, EGP pricing, WhatsApp-native, PDPL-compliant tools for audits, catalog, and growth.",
  openGraph: {
    title: "About | Wujood",
    description:
      "Learn how Wujood helps Egyptian businesses build trust online. Arabic-first, EGP pricing, WhatsApp-native, PDPL-compliant tools for audits, catalog, and growth.",
  },
};

const values = [
  {
    title: "Speed",
    body: "Get a complete audit in under 60 seconds. No manual review needed.",
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
    color: "accent-gold" as const,
  },
  {
    title: "Trust",
    body: "Bank-grade security. Your data never leaves your control.",
    icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
    color: "accent-cyan" as const,
  },
  {
    title: "Growth",
    body: "Actionable insights that drive real business results.",
    icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
    color: "green-500" as const,
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <Navigation />
      <main className="pt-[var(--spacing-nav-height)]">
        <PageHero
          eyebrow="About Wujood"
          title="Built for Egyptian Businesses"
          subtitle="We're on a mission to help Egyptian businesses build trust and grow online through automated audits, social proof, and actionable insights."
        />

        <section className="pb-[var(--spacing-section)] px-6">
          <div className="max-w-[80rem] mx-auto">
            <div className="grid md:grid-cols-3 gap-8 mb-[var(--spacing-section-sm)] animate-stagger">
              {values.map((v) => (
                <div key={v.title} className="card-lux text-center p-8">
                  <div className={`w-16 h-16 mx-auto mb-4 bg-${v.color}/10 rounded-xl flex items-center justify-center`}>
                    <svg className={`w-8 h-8 text-${v.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={v.icon} />
                    </svg>
                  </div>
                  <h3 className="text-xl font-heading font-semibold text-text-primary mb-2">{v.title}</h3>
                  <p className="text-text-secondary">{v.body}</p>
                </div>
              ))}
            </div>

            <div className="card-lux p-8 md:p-12 text-center relative overflow-hidden">
              <div className="grain" aria-hidden />
              <h2 className="relative text-3xl md:text-4xl font-heading font-bold text-text-primary mb-4">
                Local by Design
              </h2>
              <p className="relative text-lg text-text-secondary max-w-2xl mx-auto mb-8">
                We understand the local market. Arabic-first design, EGP pricing, WhatsApp integration, and compliance with Egyptian data protection laws.
              </p>
              <div className="relative flex flex-wrap justify-center gap-4">
                <span className="px-4 py-2 bg-accent-gold/10 text-accent-gold rounded-full text-sm font-medium">Arabic RTL Support</span>
                <span className="px-4 py-2 bg-accent-cyan/10 text-accent-cyan rounded-full text-sm font-medium">EGP Pricing</span>
                <span className="px-4 py-2 bg-green-500/10 text-green-500 rounded-full text-sm font-medium">PDPL Compliant</span>
                <span className="px-4 py-2 bg-purple-500/10 text-purple-500 rounded-full text-sm font-medium">WhatsApp Native</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
