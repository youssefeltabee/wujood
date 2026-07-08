"use client";
import { ChevronDown } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const faqs = [
  { q: "Do I need technical skills to use Wujood?", a: "No. We set everything up for you. You just tell us what you need and we handle the rest." },
  { q: "Can I cancel anytime?", a: "Yes. No contracts, no early termination fees. You keep what we built." },
  { q: "What if I already have a website?", a: "We can work with your existing site or build a new one. Start with a free audit to see where you stand." },
  { q: "Do you work with businesses outside Cairo?", a: "We work with Egyptian businesses everywhere. Our entire platform is remote." },
  { q: "Is support available in Arabic?", a: "Yes. Our team speaks Arabic and English. Support is included in every plan." },
];

function RevealSection({ children, delay = 1, className = "", ...props }: { children: React.ReactNode; delay?: number; className?: string } & React.HTMLAttributes<HTMLDivElement>) {
  const { ref, visible } = useScrollReveal<HTMLDivElement>();
  return (
    <div ref={ref} className={`reveal reveal-delay-${delay} ${visible ? "visible" : ""} ${className}`} {...props}>
      {children}
    </div>
  );
}

export function FAASection() {
  return (
    <section className="py-20 md:py-24 px-6 bg-bg-primary" id="faq">
      <div className="max-w-3xl mx-auto">
        <RevealSection>
          <p className="text-accent-cyan font-semibold text-xs mb-3 text-center tracking-widest uppercase">FAQ</p>
          <h2 className="text-3xl md:text-5xl font-bold text-text-primary text-center mb-14 leading-[1.1]">
            Common questions.
          </h2>
        </RevealSection>
        <div className="space-y-0">
          {faqs.map((faq, i) => (
            <details key={i} className="group border-b border-border-subtle">
              <summary className="py-5 cursor-pointer text-text-primary font-medium text-sm hover:text-accent-gold transition-colors flex items-center justify-between">
                <span>{faq.q}</span>
                <ChevronDown className="w-3 h-3 text-text-muted group-open:rotate-180 transition-transform shrink-0 ml-4" />
              </summary>
              <div className="pb-5">
                <p className="text-sm text-text-secondary leading-relaxed">{faq.a}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
