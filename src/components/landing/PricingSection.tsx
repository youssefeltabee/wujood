"use client";
import { useState } from "react";
import Link from "next/link";
import { Check, X } from "lucide-react";
import { GeometricPattern } from "@/components/ui/GeometricPattern";
import { RevealSection } from "@/components/ui/ScrollReveal";
import { TiltCard } from "@/components/ui/TiltCard";
import { Dialog, DialogContent } from "@/components/ui";
import { useLocale } from "@/lib/i18n";

interface Tier {
  id: string;
  name: string;
  nameAr: string;
  price: number;
  target: string;
  popular: boolean;
  features: string[];
}

const tiers: Tier[] = [
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

function PricingCard({ tier, onShowDetails }: { tier: Tier; onShowDetails: () => void }) {
  const { t } = useLocale();

  return (
    <TiltCard>
      <div className={`card-tilt-inner relative bg-bg-surface border ${tier.popular ? "border-accent-gold shadow-lg shadow-accent-gold/10 glow-gold" : "border-border-subtle"} rounded-3xl p-8 ${tier.popular ? "gradient-border" : ""}`}>
        {tier.popular && (
          <div className="absolute -top-3.5 left-7 bg-accent-gold text-white text-[11px] font-semibold px-3.5 py-1 rounded-full tracking-wide uppercase">
            {t("section.pricing.most-popular")}
          </div>
        )}
        <div className={`flex items-baseline gap-1.5 mb-1 ${tier.popular ? "pt-2" : ""}`}>
          <h3 className="text-xl font-bold text-text-primary">{tier.name}</h3>
          <span className="text-text-muted text-sm" dir="rtl">{tier.nameAr}</span>
        </div>
        <p className="text-sm text-text-secondary mb-6">{tier.target}</p>
        <div className="text-4xl font-bold text-text-primary mb-7">
          {tier.price.toLocaleString()}{" "}
          <span className="text-base font-normal text-text-muted">{t("section.pricing.month")}</span>
        </div>
        <ul className="space-y-3 mb-8">
          {tier.features.map((f, j) => (
            <li key={j} className="flex items-start gap-2.5 text-sm text-text-secondary">
              <Check className="w-4 h-4 text-accent-gold mt-0.5 shrink-0" />
              {f}
            </li>
          ))}
        </ul>
        {tier.popular ? (
          <Link
            href="/register"
            className="block text-center py-2.5 rounded-xl font-semibold text-sm transition-all bg-accent-gold text-white hover:brightness-110"
          >
            {t("section.pricing.start-now")}
          </Link>
        ) : (
          <button
            onClick={onShowDetails}
            className="block w-full text-center py-2.5 rounded-xl font-semibold text-sm transition-all bg-bg-elevated text-text-primary hover:bg-border-subtle cursor-pointer"
          >
            {t("section.pricing.see-details")}
          </button>
        )}
      </div>
    </TiltCard>
  );
}

export function PricingSection() {
  const { t } = useLocale();
  const [detailsTier, setDetailsTier] = useState<Tier | null>(null);

  return (
    <section className="py-24 md:py-32 px-6 relative overflow-hidden" id="pricing">
      <GeometricPattern opacity={0.015} />
      <div className="relative max-w-6xl mx-auto">
        <RevealSection>
          <p className="text-accent-cyan font-semibold text-xs mb-3 text-center tracking-widest uppercase">{t("section.pricing.label")}</p>
          <h2 className="text-3xl md:text-5xl font-bold text-text-primary text-center mb-4 leading-[1.1]">
            {t("section.pricing.heading")}
          </h2>
          <p className="text-text-secondary text-center mb-14 max-w-md mx-auto text-sm">
            {t("section.pricing.subtext")}
          </p>
        </RevealSection>
        <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {tiers.map((tier) => (
            <PricingCard key={tier.id} tier={tier} onShowDetails={() => setDetailsTier(tier)} />
          ))}
        </div>
        <p className="text-center text-xs text-text-muted mt-8">{t("section.pricing.annual")}</p>
      </div>

      <Dialog open={!!detailsTier} onOpenChange={(o) => { if (!o) setDetailsTier(null); }}>
        <DialogContent className="sm:max-w-2xl">
          {detailsTier && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-text-primary">{detailsTier.name} <span className="text-text-muted font-normal" dir="rtl">{detailsTier.nameAr}</span></h3>
                <p className="text-text-secondary text-sm mt-1">{detailsTier.target}</p>
              </div>
              <div className="text-2xl font-bold text-text-primary">
                {detailsTier.price.toLocaleString()} <span className="text-sm font-normal text-text-muted">{t("section.pricing.month")}</span>
              </div>
            </div>

            <div className="bg-bg-elevated rounded-xl p-4">
              <h4 className="font-semibold text-sm mb-3">{t("section.pricing.modal.for", { name: detailsTier.name })}</h4>
              <ul className="space-y-2">
                {detailsTier.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-text-secondary">
                    <Check className="w-4 h-4 text-accent-gold mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-xs text-text-muted text-center">{t("section.pricing.modal.annual")}</p>

            <div className="flex gap-3 pt-2">
              <Link
                href="/register"
                className="flex-1 bg-accent-gold text-white text-center py-2.5 rounded-xl font-semibold text-sm hover:brightness-110 transition-all"
              >
                {t("section.pricing.modal.cta", { price: detailsTier.price.toLocaleString() })}
              </Link>
              <a
                href="https://wa.me/201000000000"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-green-500 text-white text-center py-2.5 rounded-xl font-semibold text-sm hover:brightness-110 transition-all"
              >
                {t("section.pricing.modal.advisor")}
              </a>
            </div>
          </div>
        )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
