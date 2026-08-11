"use client";
import dynamic from "next/dynamic";
import { Check } from "lucide-react";
import { AuditForm } from "@/components/audit/AuditForm";
import { ScoreOrb } from "@/components/hero/ScoreOrb";
import { useLocale } from "@/lib/i18n";

const ThreeScene = dynamic(() => import("@/components/hero/ThreeScene").then((m) => ({ default: m.ThreeScene })), { ssr: false });

const features = ["hero.feature.whatsapp", "hero.feature.mobile", "hero.feature.social"];

export function HeroSection() {
  const { t } = useLocale();

  return (
    <section className="relative overflow-hidden pb-24 md:pb-32">
      {/* Ambient blobs */}
      <div className="absolute top-1/4 -left-24 w-96 h-96 rounded-full bg-accent-gold/5 blur-3xl animate-blob" />
      <div className="absolute bottom-1/4 -right-24 w-80 h-80 rounded-full bg-accent-cyan/5 blur-3xl animate-blob-2" />

      {/* Decorative grid */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: "linear-gradient(rgba(212,168,83,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(212,168,83,0.3) 1px, transparent 1px)",
        backgroundSize: "60px 60px"
      }} />

      <div className="relative w-full max-w-6xl mx-auto px-6 pt-12 md:pt-16">
        <div className="grid md:grid-cols-5 gap-8 items-center">
          <div className="md:col-span-3 md:pr-8">
            {/* Floating badges */}
            <div className="flex items-center gap-3 mb-6 animate-rise">
              <span className="inline-flex items-center gap-1.5 bg-accent-gold/10 text-accent-gold text-xs font-semibold px-3 py-1.5 rounded-full tracking-wide border border-accent-gold/20 animate-float">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-gold animate-pulse" />
                {t("hero.badge.free")}
              </span>
              <span className="inline-flex items-center gap-1.5 bg-accent-cyan/10 text-accent-cyan text-xs font-semibold px-3 py-1.5 rounded-full tracking-wide border border-accent-cyan/20 animate-float-delay">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse" />
                {t("hero.badge.whatsapp")}
              </span>
            </div>

            {/* Gradient heading */}
            <h1 className="text-[clamp(2.5rem,8vw,5rem)] md:text-7xl lg:text-8xl font-bold leading-[1.02] mb-5 animate-rise-2">
              <span className="gradient-text">{t("hero.heading")}</span>
            </h1>

            <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6 max-w-lg animate-rise-3">
              {t("hero.subtext")}
            </p>

            <div className="max-w-md animate-rise-3">
              <AuditForm />
            </div>

            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 animate-rise-3">
              {features.map((f) => (
                <span key={f} className="text-sm text-text-secondary flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-accent-gold" />
                  {t(f)}
                </span>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 hidden md:block md:-mr-16 lg:-mr-28">
            {/* Glow ring behind orb */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 rounded-full border border-accent-gold/10 animate-pulse-ring" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-80 h-80 rounded-full border border-accent-cyan/5 animate-spin-slow" />
              </div>
              <ThreeScene>
                <ScoreOrb />
              </ThreeScene>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
