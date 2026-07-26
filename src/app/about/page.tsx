import { Navigation } from "@/components/navigation/Navigation";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <Navigation />
      <main className="pt-[var(--spacing-nav-height)]">
        <section className="py-[var(--spacing-section)] px-6">
          <div className="max-w-[80rem] mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-text-primary mb-6">
                About Wujood
              </h1>
              <p className="text-lg text-text-secondary max-w-3xl mx-auto">
                We&apos;re on a mission to help Egyptian businesses build trust and grow online through automated audits, social proof, and actionable insights.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="text-center p-6 bg-bg-surface rounded-2xl border border-border-subtle">
                <div className="w-16 h-16 mx-auto mb-4 bg-accent-gold/10 rounded-xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-accent-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-heading font-semibold text-text-primary mb-2">Speed</h3>
                <p className="text-text-secondary">Get a complete audit in under 60 seconds. No manual review needed.</p>
              </div>
              <div className="text-center p-6 bg-bg-surface rounded-2xl border border-border-subtle">
                <div className="w-16 h-16 mx-auto mb-4 bg-accent-cyan/10 rounded-xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-accent-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-heading font-semibold text-text-primary mb-2">Trust</h3>
                <p className="text-text-secondary">Bank-grade security. Your data never leaves your control.</p>
              </div>
              <div className="text-center p-6 bg-bg-surface rounded-2xl border border-border-subtle">
                <div className="w-16 h-16 mx-auto mb-4 bg-green-500/10 rounded-xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-xl font-heading font-semibold text-text-primary mb-2">Growth</h3>
                <p className="text-text-secondary">Actionable insights that drive real business results.</p>
              </div>
            </div>

            <div className="bg-bg-surface rounded-2xl border border-border-subtle p-8 md:p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-text-primary mb-4">
                Built for Egyptian Businesses
              </h2>
              <p className="text-lg text-text-secondary max-w-2xl mx-auto mb-8">
                We understand the local market. Arabic-first design, EGP pricing, WhatsApp integration, and compliance with Egyptian data protection laws.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
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