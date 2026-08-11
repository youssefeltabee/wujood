import type { Metadata } from "next";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { Navigation } from "@/components/navigation/Navigation";

export const metadata: Metadata = {
  title: "Testimonials",
  description: "See what our customers say about their experience with Wujood.",
};

export default function TestimonialsPage() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <Navigation />
      <main className="pt-[var(--spacing-nav-height)]">
        <section className="py-[var(--spacing-section)] px-6">
          <div className="max-w-[80rem] mx-auto text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-text-primary mb-6">
              Trusted by Egyptian Businesses
            </h1>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              See what our customers say about their experience with Wujood.
            </p>
          </div>
        </section>
        <TestimonialsSection />
        <section className="py-[var(--spacing-section)] px-6">
          <div className="max-w-[80rem] mx-auto text-center">
            <h2 className="text-3xl font-heading font-bold text-text-primary mb-4">
              Ready to Join Them?
            </h2>
            <p className="text-text-secondary mb-8 max-w-lg mx-auto">
              Start your free audit today and see where you stand.
            </p>
            <a
              href="/register"
              className="inline-block bg-accent-gold text-black px-8 py-3 rounded-xl font-semibold text-base hover:brightness-110 transition-all"
            >
              Get Your Free Audit
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}