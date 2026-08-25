import type { ReactNode } from "react";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
}

export function PageHero({ eyebrow, title, subtitle, children }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden px-6 py-[var(--spacing-section-sm)]">
      {/* Geometric whisper grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(212,168,83,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(212,168,83,0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
        aria-hidden
      />
      <div className="grain" aria-hidden />

      <div className="relative max-w-[80rem] mx-auto text-center">
        <p className="section-label justify-center mb-4 animate-rise">{eyebrow}</p>
        <h1 className="text-[clamp(2.25rem,5vw,4rem)] font-heading font-bold text-text-primary leading-[1.05] mb-4 animate-rise-2">
          <span className="gradient-text">{title}</span>
        </h1>
        {subtitle && (
          <p className="text-lg text-text-secondary max-w-2xl mx-auto animate-rise-3">{subtitle}</p>
        )}
        {children}
      </div>
    </section>
  );
}
