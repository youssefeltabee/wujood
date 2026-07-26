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
    <RevealSection className="py-24 md:py-32 px-6" id="problem">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-5 gap-10 items-center">
          <div className="md:col-span-3 md:pr-8">
            <p className="text-accent-cyan font-semibold text-xs mb-3 tracking-widest uppercase">{t("section.problem.label")}</p>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-text-primary mb-6 leading-[1.05]">
              {t("section.problem.heading")}
            </h2>
            <p className="text-text-secondary leading-relaxed max-w-lg mb-8">
              {t("section.problem.body", { amount: "3.5 billion EGP" })}
            </p>
            <div className="grid grid-cols-2 gap-3">
              {painKeys.map((key, i) => (
                <div key={key} className="pain-point-card flex items-center gap-2.5 text-sm text-text-secondary bg-bg-surface border border-border-subtle rounded-xl px-4 py-3 cursor-default">
                  <span className="pain-point-icon text-accent-gold shrink-0">{iconMap[["Search", "Smartphone", "CreditCard", "Globe"][i]]}</span>
                  {t(key)}
                </div>
              ))}
            </div>
          </div>
          <div className="md:col-span-2">
            <div className="bg-accent-gold rounded-3xl p-10 md:p-12 text-center text-white">
              <div className="text-8xl font-bold mb-2 opacity-90">80%</div>
              <p className="text-white/80 text-sm max-w-xs mx-auto">{t("section.problem.stat")}</p>
              <div className="mt-8 pt-8 border-t border-white/15">
                <p className="text-white/60 text-xs">{t("section.problem.source")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RevealSection>
  );
}
