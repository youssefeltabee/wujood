"use client";
import Link from "next/link";
import { Star } from "lucide-react";
import { GeometricPattern } from "@/components/ui/GeometricPattern";
import { Carousel } from "@/components/ui/Carousel";
import { useLocale } from "@/lib/i18n";

// ponytail: placeholder until real clients — swap when Saif provides
const testimonials = [
  { name: "أحمد", business: "مخبز الفجر، حلوان", quote: "التدقيق وضّح لنا مشاكل بسيطة في الصفحة ورقم الواتساب. أصلحناها بسرعة وبقى التواصل أسهل مع الزبائن.", improvement: "+42 points", example: true },
  { name: "سارة", business: "صالون لمسة، المعادي", quote: "كنا ننشر قليل جداً. بعد التوصيات نظمنا النشر وبدأت الحجوزات تزيد بشكل ملحوظ.", improvement: "+38 points", example: true },
];

function initials(name: string) {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("");
}

export function TestimonialsSection() {
  const { t } = useLocale();
  const slides = testimonials.map((tst) => (
    <article key={tst.name} className="card-lux card-tilt-inner relative overflow-hidden p-6 md:p-8 text-left">
      <div className="pointer-events-none absolute -top-10 -right-10 w-32 h-32 rounded-full bg-accent-gold/10 blur-2xl" aria-hidden />
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star key={s} className="w-3 h-3 text-accent-gold fill-accent-gold" aria-hidden />
          ))}
        </div>
        {tst.example && (
          <span className="text-[10px] tracking-widest font-bold uppercase bg-bg-elevated border border-line-subtle text-text-muted px-2 py-1 rounded-full">
            مثال توضيحي · Example
          </span>
        )}
      </div>
      <p className="text-text-secondary leading-relaxed text-base md:text-lg mb-6">&ldquo;{tst.quote}&rdquo;</p>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid place-items-center w-11 h-11 rounded-full bg-gradient-to-br from-accent-gold to-accent-cyan text-bg-primary font-bold text-sm" aria-hidden>
            {initials(tst.name)}
          </span>
          <div>
            <p className="font-semibold text-text-primary text-sm">{tst.name}</p>
            <p className="text-xs text-text-muted">{tst.business}</p>
          </div>
        </div>
        <span className="text-xs font-bold bg-score-high/20 text-score-high px-3 py-1 rounded-full whitespace-nowrap">
          {tst.improvement}
        </span>
      </div>
    </article>
  ));

  return (
    <section className="py-[var(--spacing-section)] px-6 bg-bg-elevated relative overflow-hidden">
      <GeometricPattern opacity={0.06} />
      <div className="relative max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <p className="section-label justify-center mb-4">{t("section.testimonials.label")}</p>
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary leading-[1.1]">
            {t("section.testimonials.heading")}
          </h2>
        </div>
        <Carousel slides={slides} ariaLabel="Customer testimonials" autoPlayMs={6000} />
        <div className="mt-10 text-center">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-accent-gold text-white px-6 py-3 rounded-xl font-semibold text-sm hover:brightness-110 transition-all"
          >
            {t("section.testimonials.cta")}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
