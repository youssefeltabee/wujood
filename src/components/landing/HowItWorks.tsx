"use client";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { GeometricPattern } from "@/components/ui/GeometricPattern";

const howItWorks = [
  { step: "01", title: "We scan your business", desc: "Enter your website URL. Our audit checks 10 categories: mobile readiness, speed, SEO, social media activity, pricing, payments, and more." },
  { step: "02", title: "You get your score", desc: "A clear 0-100 Digital Presence Score. You will see exactly what is missing and what is working. No jargon, no fluff." },
  { step: "03", title: "We build what you need", desc: "Pick a plan. We set up your website, connect your WhatsApp, link your social media, and get you visible. You focus on running your business." },
];

function StepCard({ item, index }: { item: typeof howItWorks[0]; index: number }) {
  const { ref, visible } = useScrollReveal<HTMLDivElement>(0.2);
  return (
    <div ref={ref} className={`step-card transition-all duration-700 ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}>
      <div className="flex items-start gap-5">
        <div className="step-number text-6xl font-bold text-accent-gold/20 leading-none shrink-0 w-16 text-right">{item.step}</div>
        <div className="border-l-2 border-accent-gold/20 pl-5">
          <h3 className="text-xl font-bold text-text-primary mb-2">{item.title}</h3>
          <p className="text-text-secondary leading-relaxed text-sm">{item.desc}</p>
        </div>
      </div>
    </div>
  );
}

export function HowItWorks() {
  const { ref: howRef } = useScrollReveal<HTMLDivElement>(0.1);

  return (
    <section className="py-24 md:py-32 px-6 bg-bg-surface relative overflow-hidden" id="how-it-works">
      <GeometricPattern opacity={0.015} />
      <div className="relative max-w-6xl mx-auto" ref={howRef}>
        <div className="grid md:grid-cols-5 gap-12 md:gap-16">
          <div className="md:col-span-2 md:sticky md:top-32 md:h-fit">
            <p className="text-accent-cyan font-semibold text-xs mb-3 tracking-widest uppercase">How It Works</p>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-text-primary leading-[1.05]">
              Three steps to a real online presence.
            </h2>
          </div>
          <div className="md:col-span-3 space-y-10 md:space-y-14">
            {howItWorks.map((item, i) => (
              <StepCard key={item.step} item={item} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
