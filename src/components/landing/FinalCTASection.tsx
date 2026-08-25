"use client";
import { AuditForm } from "@/components/audit/AuditForm";
import { RevealSection } from "@/components/ui/ScrollReveal";
import { useLocale } from "@/lib/i18n";

export function FinalCTASection() {
  const { t } = useLocale();

  return (
    <section className="py-[var(--spacing-section)] px-6 relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 animated-gradient-bg" />
      {/* Glow orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-accent-gold/5 blur-3xl" />

      <div className="relative">
        <RevealSection>
          <div className="max-w-2xl mx-auto text-center">
            <p className="section-label justify-center mb-4">{t("section.cta.label")}</p>
            <h2 className="text-3xl md:text-5xl font-bold mb-5 leading-[1.1]">
              <span className="gradient-text">{t("section.cta.heading")}</span>
            </h2>
            <p className="text-text-secondary mb-8 max-w-sm mx-auto">
              {t("section.cta.subtext")}
            </p>
            <div className="max-w-md mx-auto relative overflow-hidden rounded-2xl glass-panel focus-ring-gold p-6">
              <div className="grain" aria-hidden />
              <AuditForm />
            </div>
          </div>
        </RevealSection>
      </div>
    </section>
  );
}
