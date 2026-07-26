import { PricingSection } from "@/components/landing/PricingSection";
import { Navigation } from "@/components/navigation/Navigation";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <Navigation />
      <main className="pt-[var(--spacing-nav-height)]">
        <section className="py-[var(--spacing-section)] px-6">
          <div className="max-w-[80rem] mx-auto text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-text-primary mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Choose the plan that fits your business. All plans include a 14-day free trial.
            </p>
          </div>
        </section>
        <PricingSection />
        <section className="py-[var(--spacing-section)] px-6">
          <div className="max-w-[80rem] mx-auto">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="p-6 bg-bg-surface rounded-2xl border border-border-subtle">
                <div className="w-12 h-12 mx-auto mb-4 bg-accent-gold/10 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-accent-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-heading font-semibold text-text-primary mb-2">14-Day Free Trial</h3>
                <p className="text-text-secondary">Full access to all features. No credit card required.</p>
              </div>
              <div className="p-6 bg-bg-surface rounded-2xl border border-border-subtle">
                <div className="w-12 h-12 mx-auto mb-4 bg-accent-cyan/10 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-accent-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-heading font-semibold text-text-primary mb-2">Secure & Compliant</h3>
                <p className="text-text-secondary">Bank-grade encryption. GDPR & PDPL compliant.</p>
              </div>
              <div className="p-6 bg-bg-surface rounded-2xl border border-border-subtle">
                <div className="w-12 h-12 mx-auto mb-4 bg-green-500/10 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-heading font-semibold text-text-primary mb-2">Cancel Anytime</h3>
                <p className="text-text-secondary">No long-term contracts. Export your data anytime.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}