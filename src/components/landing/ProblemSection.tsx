"use client";
import { Search, Smartphone, CreditCard, Globe } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const painPoints = [
  { icon: "Search", text: "No pricing on their website" },
  { icon: "Smartphone", text: "Social media dormant for months" },
  { icon: "CreditCard", text: "No online payment options" },
  { icon: "Globe", text: "Hard to find on Google" },
];

const iconMap: Record<string, React.ReactNode> = {
  Search: <Search className="w-4 h-4" />,
  Smartphone: <Smartphone className="w-4 h-4" />,
  CreditCard: <CreditCard className="w-4 h-4" />,
  Globe: <Globe className="w-4 h-4" />,
};

function RevealSection({ children, delay = 1, className = "", ...props }: { children: React.ReactNode; delay?: number; className?: string } & React.HTMLAttributes<HTMLDivElement>) {
  const { ref, visible } = useScrollReveal<HTMLDivElement>();
  return (
    <div ref={ref} className={`reveal reveal-delay-${delay} ${visible ? "visible" : ""} ${className}`} {...props}>
      {children}
    </div>
  );
}

export function ProblemSection() {
  return (
    <RevealSection className="py-24 md:py-32 px-6" id="problem">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-5 gap-10 items-center">
          <div className="md:col-span-3 md:pr-8">
            <p className="text-accent-cyan font-semibold text-xs mb-3 tracking-widest uppercase">The Problem</p>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-text-primary mb-6 leading-[1.05]">
              8 out of 10 Egyptian SMEs are invisible online.
            </h2>
            <p className="text-text-secondary leading-relaxed max-w-lg mb-8">
              That is roughly <strong className="text-text-primary">3.5 billion EGP</strong> in missed business every year. Not because their product is bad — because customers could not find them when they needed them.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {painPoints.map((p) => (
                <div key={p.text} className="pain-point-card flex items-center gap-2.5 text-sm text-text-secondary bg-bg-surface border border-border-subtle rounded-xl px-4 py-3 cursor-default">
                  <span className="pain-point-icon text-accent-gold shrink-0">{iconMap[p.icon]}</span>
                  {p.text}
                </div>
              ))}
            </div>
          </div>
          <div className="md:col-span-2">
            <div className="bg-accent-gold rounded-3xl p-10 md:p-12 text-center text-white">
              <div className="text-8xl font-bold mb-2 opacity-90">80%</div>
              <p className="text-white/80 text-sm max-w-xs mx-auto">of Egyptian SMEs have no real online presence</p>
              <div className="mt-8 pt-8 border-t border-white/15">
                <p className="text-white/60 text-xs">Based on an analysis of 500 Egyptian business websites</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RevealSection>
  );
}
