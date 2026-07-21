"use client";
import Link from "next/link";
import { Star } from "lucide-react";
import { GeometricPattern } from "@/components/ui/GeometricPattern";
import { Carousel } from "@/components/ui/Carousel";

const testimonials = [
  { name: "Ahmed H.", business: "Electronics Shop, Alexandria", quote: "I did not know my website was broken on phones. Wujood fixed it and set up my WhatsApp in two days.", improvement: "+45 points" },
  { name: "Mariam K.", business: "Cairo Bakery Chain", quote: "We had 3 Instagram posts in two years. Now we post weekly and our orders went up 30%.", improvement: "+38 points" },
  { name: "Tarek S.", business: "Furniture Workshop, Mansoura", quote: "Customers kept asking for prices on WhatsApp. Now they can see everything on our site.", improvement: "+52 points" },
  { name: "Laila M.", business: "Beauty Salon, Giza", quote: "The audit showed my booking link was dead. Fixed it, and my evening slots fill up now.", improvement: "+41 points" },
  { name: "Omar F.", business: "Auto Parts, Tanta", quote: "Honestly I thought digital presence was for big companies. Wujood proved me wrong for my shop.", improvement: "+49 points" },
];

function initials(name: string) {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("");
}

export function TestimonialsSection() {
  const slides = testimonials.map((t) => (
    <article className="card-tilt-inner relative overflow-hidden bg-bg-surface border border-border-subtle rounded-2xl p-6 md:p-8 text-left transition-transform duration-300 hover:-translate-y-1">
      <div className="pointer-events-none absolute -top-10 -right-10 w-32 h-32 rounded-full bg-accent-gold/10 blur-2xl" aria-hidden />
      <div className="flex items-center gap-1 mb-4">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star key={s} className="w-3 h-3 text-accent-gold fill-accent-gold" aria-hidden />
        ))}
      </div>
      <p className="text-text-secondary leading-relaxed text-base md:text-lg mb-6">&ldquo;{t.quote}&rdquo;</p>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid place-items-center w-11 h-11 rounded-full bg-gradient-to-br from-accent-gold to-accent-cyan text-bg-primary font-bold text-sm" aria-hidden>
            {initials(t.name)}
          </span>
          <div>
            <p className="font-semibold text-text-primary text-sm">{t.name}</p>
            <p className="text-xs text-text-muted">{t.business}</p>
          </div>
        </div>
        <span className="text-xs font-bold bg-score-high/20 text-score-high px-3 py-1 rounded-full whitespace-nowrap">
          {t.improvement}
        </span>
      </div>
    </article>
  ));

  return (
    <section className="py-20 md:py-24 px-6 bg-bg-elevated relative overflow-hidden">
      <GeometricPattern opacity={0.06} />
      <div className="relative max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-text-secondary font-semibold text-xs mb-3 tracking-widest uppercase">Real Results</p>
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary leading-[1.1]">
            Businesses we have helped show up online.
          </h2>
        </div>
        <Carousel slides={slides} ariaLabel="Customer testimonials" autoPlayMs={6000} />
        <div className="mt-10 text-center">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-accent-gold text-white px-6 py-3 rounded-xl font-semibold text-sm hover:brightness-110 transition-all"
          >
            ابدأ دلوقتي
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
