import type { Metadata } from "next";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { Navigation } from "@/components/navigation/Navigation";
import { PageHero } from "@/components/landing/PageHero";

export const metadata: Metadata = {
  title: "Testimonials | Wujood",
  description:
    "Hear from Egyptian businesses growing with Wujood. Real stories about audits, catalog, and WhatsApp tools that build trust, drive sales, and deliver results.",
  openGraph: {
    title: "Testimonials | Wujood",
    description:
      "Hear from Egyptian businesses growing with Wujood. Real stories about audits, catalog, and WhatsApp tools that build trust, drive sales, and deliver results.",
  },
};

export default function TestimonialsPage() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <Navigation />
      <main className="pt-[var(--spacing-nav-height)]">
        <PageHero
          eyebrow="Testimonials"
          title="Trusted by Egyptian Businesses"
          subtitle="See what our customers say about their experience with Wujood."
        />
        <TestimonialsSection />
        <section className="pb-[var(--spacing-section)] px-6">
          <div className="max-w-[80rem] mx-auto text-center">
            <h2 className="text-3xl font-heading font-bold text-text-primary mb-4">
              Ready to Join Them?
            </h2>
            <p className="text-text-secondary mb-8 max-w-lg mx-auto">
              Start your free audit today and see where you stand.
            </p>
            <a
              href="/register"
              className="inline-block bg-accent-gold text-black px-8 py-3 rounded-xl font-semibold text-base hover:brightness-110 transition-all focus-ring-gold"
            >
              Get Your Free Audit
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
