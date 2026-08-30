import type { Metadata } from "next";
import { FinalCTASection } from "@/components/landing/FinalCTASection";
import { Navigation } from "@/components/navigation/Navigation";
import { PageHero } from "@/components/landing/PageHero";

export const metadata: Metadata = {
  title: "Contact | Wujood",
  description:
    "Contact Wujood for custom plans, pricing help, and expert support. Reach us via email, WhatsApp, or Smart Village Cairo to build your digital presence in Egypt.",
  openGraph: {
    title: "Contact | Wujood",
    description:
      "Contact Wujood for custom plans, pricing help, and expert support. Reach us via email, WhatsApp, or Smart Village Cairo to build your digital presence in Egypt.",
  },
};

export const dynamic = "force-dynamic";

const contactMethods = [
  {
    title: "Email Us",
    value: "youssefeltabee@gmail.com",
    href: "mailto:youssefeltabee@gmail.com",
    icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
    color: "accent-gold" as const,
  },
  {
    title: "WhatsApp",
    value: "+20 10 0000 0000",
    href: "tel:+201000000000",
    icon: "M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z",
    color: "accent-cyan" as const,
  },
  {
    title: "Office",
    value: "Smart Village, Cairo, Egypt",
    href: null as string | null,
    icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z",
    color: "green-500" as const,
  },
];

const inputClasses =
  "w-full bg-bg-primary border border-border-default rounded-xl px-4 py-3 text-text-primary placeholder-text-muted focus:border-accent-gold focus:outline-none focus:ring-2 focus:ring-accent-gold/20 focus-ring-gold transition-colors";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <Navigation />
      <main className="pt-[var(--spacing-nav-height)]">
        <PageHero
          eyebrow="Contact"
          title="Let's Build Your Digital Presence"
          subtitle="Have questions? Want a custom plan? Our team is here to help you succeed online."
        />

        <section className="pb-[var(--spacing-section)] px-6">
          <div className="max-w-[80rem] mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <div className="space-y-6 animate-stagger">
                {contactMethods.map((m) => (
                  <div key={m.title} className="card-lux flex items-center gap-4 p-5">
                    <div className={`w-10 h-10 bg-${m.color}/10 rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <svg className={`w-5 h-5 text-${m.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={m.icon} />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-text-primary">{m.title}</h3>
                      {m.href ? (
                        <a href={m.href} className="text-text-secondary hover:text-accent-gold transition-colors">{m.value}</a>
                      ) : (
                        <p className="text-text-secondary">{m.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="card-lux relative overflow-hidden p-8">
                <div className="grain" aria-hidden />
                <h2 className="relative text-2xl font-heading font-bold text-text-primary mb-6">Send a Message</h2>
                <form className="relative space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-1">Name</label>
                      <input id="name" type="text" required className={inputClasses} placeholder="Your name" />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-1">Email</label>
                      <input id="email" type="email" required className={inputClasses} placeholder="your@email.com" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-text-secondary mb-1">Company</label>
                    <input id="company" type="text" className={inputClasses} placeholder="Company name (optional)" />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-text-secondary mb-1">Message</label>
                    <textarea id="message" rows={5} required className={`${inputClasses} resize-none`} placeholder="How can we help you?" />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-accent-gold text-black py-3 px-6 rounded-xl font-semibold text-base hover:brightness-110 transition-all focus-ring-gold"
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
