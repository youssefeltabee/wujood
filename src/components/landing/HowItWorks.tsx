"use client";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { GeometricPattern } from "@/components/ui/GeometricPattern";
import { useLocale } from "@/lib/i18n";

const howItWorks = [
  { step: "01", titleKey: "section.how-it-works.step1.title", descKey: "section.how-it-works.step1.desc" },
  { step: "02", titleKey: "section.how-it-works.step2.title", descKey: "section.how-it-works.step2.desc" },
  { step: "03", titleKey: "section.how-it-works.step3.title", descKey: "section.how-it-works.step3.desc" },
];

function StepCard({ item, index, t }: { item: typeof howItWorks[0]; index: number; t: (key: string) => string }) {
  const { ref, visible } = useScrollReveal<HTMLDivElement>(0.2);
  return (
    <div ref={ref} className={`step-card transition-all duration-700 ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}>
      <div className="flex items-start gap-5">
        <div className="step-number text-6xl font-bold text-accent-gold/20 leading-none shrink-0 w-16 text-right">{item.step}</div>
        <div className="border-l-2 border-accent-gold/20 pl-5">
          <h3 className="text-xl font-bold text-text-primary mb-2">{t(item.titleKey)}</h3>
          <p className="text-text-secondary leading-relaxed text-sm">{t(item.descKey)}</p>
        </div>
      </div>
    </div>
  );
}

export function HowItWorks() {
  const { ref: howRef } = useScrollReveal<HTMLDivElement>(0.1);
  const { t } = useLocale();

  return (
    <section className="py-24 md:py-32 px-6 bg-bg-surface relative overflow-hidden" id="how-it-works">
      <GeometricPattern opacity={0.015} />
      <div className="relative max-w-6xl mx-auto" ref={howRef}>
        <div className="grid md:grid-cols-5 gap-12 md:gap-16">
          <div className="md:col-span-2 md:sticky md:top-32 md:h-fit">
            <p className="text-accent-cyan font-semibold text-xs mb-3 tracking-widest uppercase">{t("section.how-it-works.label")}</p>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-text-primary leading-[1.05]">
              {t("section.how-it-works.heading")}
            </h2>
          </div>
          <div className="md:col-span-3 space-y-10 md:space-y-14">
            {howItWorks.map((item, i) => (
              <StepCard key={item.step} item={item} index={i} t={t} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
