"use client";
import { AuditForm } from "@/components/audit/AuditForm";
import { useScrollReveal } from "@/hooks/useScrollReveal";

function RevealSection({ children, delay = 1, className = "", ...props }: { children: React.ReactNode; delay?: number; className?: string } & React.HTMLAttributes<HTMLDivElement>) {
  const { ref, visible } = useScrollReveal<HTMLDivElement>();
  return (
    <div ref={ref} className={`reveal reveal-delay-${delay} ${visible ? "visible" : ""} ${className}`} {...props}>
      {children}
    </div>
  );
}

export function FinalCTASection() {
  return (
    <section className="py-24 md:py-28 px-6 bg-bg-elevated">
      <div className="h-px bg-accent-gold/20" />
      <RevealSection>
        <div className="max-w-2xl mx-auto text-center pt-16">
          <h2 className="text-3xl md:text-5xl font-bold text-text-primary mb-5 leading-[1.1]">
            See where your business stands.
          </h2>
          <p className="text-text-secondary mb-8 max-w-sm mx-auto">
            Enter your website URL. Get a free Digital Presence Score and a full breakdown of what is missing. It takes 30 seconds.
          </p>
          <div className="max-w-md mx-auto">
            <AuditForm />
          </div>
        </div>
      </RevealSection>
    </section>
  );
}
