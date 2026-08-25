"use client";
import { Search, Smartphone, CreditCard, Globe } from "lucide-react";
import { RevealSection } from "@/components/ui/ScrollReveal";
import { useLocale } from "@/lib/i18n";

const painKeys = ["section.problem.pain.1", "section.problem.pain.2", "section.problem.pain.3", "section.problem.pain.4"];

const iconMap: Record<string, React.ReactNode> = {
  Search: <Search className="w-4 h-4" />,
  Smartphone: <Smartphone className="w-4 h-4" />,
  CreditCard: <CreditCard className="w-4 h-4" />,
  Globe: <Globe className="w-4 h-4" />,
};

export function ProblemSection() {
  const { t } = useLocale();

  return (
    <RevealSection className="py-[var(--spacing-section)] px-6" id="problem">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-5 gap-10 items-center">
          <div className="md:col-span-3 md:pr-8">
            <p className="section-label mb-4">{t("section.problem.label")}</p>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-text-primary mb-6 leading-[1.05]">
              {t("section.problem.heading")}
            </h2>
            <p className="text-text-secondary leading-relaxed max-w-lg mb-8">
              {t("section.problem.body", { amount: "3.5 billion EGP" })}
            </p>
            <div className="grid grid-cols-2 gap-3">
              {painKeys.map((key, i) => (
                <div key={key} className="pain-point-card card-lux flex items-center gap-2.5 text-sm text-text-secondary px-4 py-3 cursor-default">
                  <span className="pain-point-icon text-accent-gold shrink-0">{iconMap[["Search", "Smartphone", "CreditCard", "Globe"][i]]}</span>
                  {t(key)}
                </div>
              ))}
            </div>
          </div>
          <div className="md:col-span-2">
            <div className="relative rounded-3xl overflow-hidden">
              {/* Gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent-gold via-accent-gold to-amber-600" />
              {/* Noise texture */}
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")" }} />
              <div className="relative p-10 md:p-12 text-center text-white">
                <div className="text-8xl font-bold mb-2 opacity-90">80%</div>
                <p className="text-white/80 text-sm max-w-xs mx-auto">{t("section.problem.stat")}</p>
                <div className="mt-8 pt-8 border-t border-white/15">
                  <p className="text-white/60 text-xs">{t("section.problem.source")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RevealSection>
  );
}
