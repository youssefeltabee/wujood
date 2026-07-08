"use client";
import Link from "next/link";
import { Check } from "lucide-react";
import { GeometricPattern } from "@/components/ui/GeometricPattern";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useRef, useCallback } from "react";

const tiers = [
  {
    id: "kashif", name: "Kashif", nameAr: "كاشف", price: 1250,
    target: "Sole proprietors and freelancers", popular: false,
    features: ["A mobile-friendly website", "WhatsApp click-to-chat", "1 social media account", "Ghost Audit report", "Email support"],
  },
  {
    id: "sane", name: "Sane'", nameAr: "صانع", price: 2500,
    target: "Small to medium businesses (5-20)", popular: true,
    features: ["Everything in Kashif", "WhatsApp Business API", "3 social media accounts", "Online catalog builder", "Review and trust builder", "Priority support"],
  },
  {
    id: "raed", name: "Ra'ed", nameAr: "رائد", price: 4500,
    target: "Growing businesses (20-50)", popular: false,
    features: ["Everything in Sane'", "AI chatbot in Arabic and English", "Unlimited social accounts", "Custom domain", "Advanced analytics", "Dedicated account manager"],
  },
];

function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const card = ref.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const tiltX = (y - 0.5) * -8;
    const tiltY = (x - 0.5) * 8;
    const inner = card.querySelector(".card-tilt-inner") as HTMLElement;
    if (inner) {
      inner.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
      inner.style.setProperty("--mx", `${x * 100}%`);
      inner.style.setProperty("--my", `${y * 100}%`);
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    const card = ref.current;
    if (!card) return;
    const inner = card.querySelector(".card-tilt-inner") as HTMLElement;
    if (inner) {
      inner.style.transform = "rotateX(0deg) rotateY(0deg)";
    }
  }, []);

  return (
    <div ref={ref} className={`card-tilt ${className}`} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      {children}
    </div>
  );
}

function RevealSection({ children, delay = 1, className = "", ...props }: { children: React.ReactNode; delay?: number; className?: string } & React.HTMLAttributes<HTMLDivElement>) {
  const { ref, visible } = useScrollReveal<HTMLDivElement>();
  return (
    <div ref={ref} className={`reveal reveal-delay-${delay} ${visible ? "visible" : ""} ${className}`} {...props}>
      {children}
    </div>
  );
}

export function PricingSection() {
  return (
    <section className="py-24 md:py-32 px-6 relative overflow-hidden" id="pricing">
      <GeometricPattern opacity={0.015} />
      <div className="relative max-w-6xl mx-auto">
        <RevealSection>
          <p className="text-accent-cyan font-semibold text-xs mb-3 text-center tracking-widest uppercase">Pricing</p>
          <h2 className="text-3xl md:text-5xl font-bold text-text-primary text-center mb-4 leading-[1.1]">
            Plans for every stage of business.
          </h2>
          <p className="text-text-secondary text-center mb-14 max-w-md mx-auto text-sm">
            All prices in EGP. No hidden fees. Cancel anytime.
          </p>
        </RevealSection>
        <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
          <div className="flex flex-col gap-5">
            <TiltCard>
              <div className="card-tilt-inner relative bg-bg-surface border border-border-subtle rounded-3xl p-8">
                <div className="flex items-baseline gap-1.5 mb-1">
                  <h3 className="text-xl font-bold text-text-primary">{tiers[0].name}</h3>
                  <span className="text-text-muted text-sm" dir="rtl">{tiers[0].nameAr}</span>
                </div>
                <p className="text-sm text-text-secondary mb-6">{tiers[0].target}</p>
                <div className="text-4xl font-bold text-text-primary mb-7">
                  {tiers[0].price.toLocaleString()}{" "}
                  <span className="text-base font-normal text-text-muted">EGP/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {tiers[0].features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-sm text-text-secondary">
                      <Check className="w-4 h-4 text-accent-gold mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/register" className="block text-center py-2.5 rounded-xl font-semibold text-sm bg-bg-elevated text-text-primary hover:bg-border-subtle transition-colors">See Details</Link>
              </div>
            </TiltCard>
          </div>
          <div className="flex flex-col gap-5">
            <TiltCard>
              <div className="card-tilt-inner relative bg-bg-surface border border-border-subtle ring-2 ring-accent-gold shadow-lg shadow-accent-gold/10 rounded-3xl p-8">
                <div className="absolute -top-3.5 left-7 bg-accent-gold text-white text-[11px] font-semibold px-3.5 py-1 rounded-full tracking-wide uppercase">Most Popular</div>
                <div className="flex items-baseline gap-1.5 mb-1 pt-2">
                  <h3 className="text-xl font-bold text-text-primary">{tiers[1].name}</h3>
                  <span className="text-text-muted text-sm" dir="rtl">{tiers[1].nameAr}</span>
                </div>
                <p className="text-sm text-text-secondary mb-6">{tiers[1].target}</p>
                <div className="text-4xl font-bold text-text-primary mb-7">
                  {tiers[1].price.toLocaleString()}{" "}
                  <span className="text-base font-normal text-text-muted">EGP/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {tiers[1].features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-sm text-text-secondary">
                      <Check className="w-4 h-4 text-accent-gold mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/register" className="block text-center py-2.5 rounded-xl font-semibold text-sm bg-accent-gold text-white hover:brightness-110 transition-all">ابدأ دلوقتي</Link>
              </div>
            </TiltCard>
            <TiltCard>
              <div className="card-tilt-inner relative bg-bg-surface border border-border-subtle rounded-3xl p-8">
                <div className="flex items-baseline gap-1.5 mb-1">
                  <h3 className="text-xl font-bold text-text-primary">{tiers[2].name}</h3>
                  <span className="text-text-muted text-sm" dir="rtl">{tiers[2].nameAr}</span>
                </div>
                <p className="text-sm text-text-secondary mb-6">{tiers[2].target}</p>
                <div className="text-4xl font-bold text-text-primary mb-7">
                  {tiers[2].price.toLocaleString()}{" "}
                  <span className="text-base font-normal text-text-muted">EGP/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {tiers[2].features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-sm text-text-secondary">
                      <Check className="w-4 h-4 text-accent-gold mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/register" className="block text-center py-2.5 rounded-xl font-semibold text-sm bg-bg-elevated text-text-primary hover:bg-border-subtle transition-colors">See Details</Link>
              </div>
            </TiltCard>
          </div>
        </div>
        <p className="text-center text-xs text-text-muted mt-8">Annual billing: 10 months for 12 (17% off). 7-day free trial on all plans.</p>
      </div>
    </section>
  );
}
