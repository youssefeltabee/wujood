"use client";
import { ChevronDown } from "lucide-react";
import { RevealSection } from "@/components/ui/ScrollReveal";
import { useLocale } from "@/lib/i18n";

const faqKeys = [
  { q: "section.faq.q1", a: "section.faq.a1" },
  { q: "section.faq.q2", a: "section.faq.a2" },
  { q: "section.faq.q3", a: "section.faq.a3" },
  { q: "section.faq.q4", a: "section.faq.a4" },
  { q: "section.faq.q5", a: "section.faq.a5" },
];

export function FAASection() {
  const { t } = useLocale();

  return (
    <section className="py-[var(--spacing-section)] px-6 bg-bg-primary" id="faq">
      <div className="max-w-3xl mx-auto">
        <RevealSection>
          <p className="section-label justify-center mb-4">{t("section.faq.label")}</p>
          <h2 className="text-3xl md:text-5xl font-bold text-text-primary text-center mb-14 leading-[1.1]">
            {t("section.faq.heading")}
          </h2>
        </RevealSection>
        <div className="space-y-0">
          {faqKeys.map((faq, i) => (
            <details key={i} className="group border-b border-border-subtle">
              <summary className="py-5 cursor-pointer text-text-primary font-medium text-sm hover:text-accent-gold transition-colors flex items-center justify-between">
                <span>{t(faq.q)}</span>
                <ChevronDown className="w-3 h-3 text-text-muted group-open:rotate-180 transition-transform shrink-0 ml-4" />
              </summary>
              <div className="pb-5">
                <p className="text-sm text-text-secondary leading-relaxed">{t(faq.a)}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
