"use client";

import { FinalCTASection } from "@/components/landing/FinalCTASection";
import { Navigation } from "@/components/navigation/Navigation";

export const dynamic = "force-dynamic";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <Navigation />
      <main className="pt-[var(--spacing-nav-height)]">
        <section className="py-[var(--spacing-section)] px-6">
          <div className="max-w-[80rem] mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <div>
                <h1 className="text-4xl md:text-5xl font-heading font-bold text-text-primary mb-6">
                  Let&apos;s Build Your Digital Presence
                </h1>
                <p className="text-lg text-text-secondary mb-8 max-w-lg">
                  Have questions? Want a custom plan? Our team is here to help you succeed online.
                </p>
                <div className="space-y-6">
                  <div className="flex items-center gap-4 p-4 bg-bg-surface rounded-xl border border-border-subtle">
                    <div className="w-10 h-10 bg-accent-gold/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-accent-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-text-primary">Email Us</h3>
                      <p className="text-text-secondary">hello@wujood.app</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-bg-surface rounded-xl border border-border-subtle">
                    <div className="w-10 h-10 bg-accent-cyan/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-accent-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-text-primary">WhatsApp</h3>
                      <p className="text-text-secondary">+20 1XX XXX XXXX</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-bg-surface rounded-xl border border-border-subtle">
                    <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-text-primary">Office</h3>
                      <p className="text-text-secondary">Smart Village, Cairo, Egypt</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-bg-surface rounded-2xl border border-border-subtle p-8">
                <h2 className="text-2xl font-heading font-bold text-text-primary mb-6">Send a Message</h2>
                <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-1">Name</label>
                      <input
                        id="name"
                        type="text"
                        required
                        className="w-full bg-bg-primary border border-border-default rounded-xl px-4 py-3 text-text-primary placeholder-text-muted focus:border-accent-gold focus:outline-none focus:ring-2 focus:ring-accent-gold/20 transition-colors"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-1">Email</label>
                      <input
                        id="email"
                        type="email"
                        required
                        className="w-full bg-bg-primary border border-border-default rounded-xl px-4 py-3 text-text-primary placeholder-text-muted focus:border-accent-gold focus:outline-none focus:ring-2 focus:ring-accent-gold/20 transition-colors"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-text-secondary mb-1">Company</label>
                    <input
                      id="company"
                      type="text"
                      className="w-full bg-bg-primary border border-border-default rounded-xl px-4 py-3 text-text-primary placeholder-text-muted focus:border-accent-gold focus:outline-none focus:ring-2 focus:ring-accent-gold/20 transition-colors"
                      placeholder="Company name (optional)"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-text-secondary mb-1">Message</label>
                    <textarea
                      id="message"
                      rows={5}
                      required
                      className="w-full bg-bg-primary border border-border-default rounded-xl px-4 py-3 text-text-primary placeholder-text-muted focus:border-accent-gold focus:outline-none focus:ring-2 focus:ring-accent-gold/20 transition-colors resize-none"
                      placeholder="How can we help you?"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-accent-gold text-black py-3 px-6 rounded-xl font-semibold text-base hover:brightness-110 transition-all"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
        <FinalCTASection />
      </main>
    </div>
  );
}