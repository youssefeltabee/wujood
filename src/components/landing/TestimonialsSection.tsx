"use client";
import Link from "next/link";
import { Star } from "lucide-react";
import { GeometricPattern } from "@/components/ui/GeometricPattern";
import { RevealSection } from "@/components/ui/ScrollReveal";
import { TiltCard } from "@/components/ui/TiltCard";

const testimonials = [
  { name: "Ahmed H.", business: "Electronics Shop, Alexandria", quote: "I did not know my website was broken on phones. Wujood fixed it and set up my WhatsApp in two days.", improvement: "+45 points" },
  { name: "Mariam K.", business: "Cairo Bakery Chain", quote: "We had 3 Instagram posts in two years. Now we post weekly and our orders went up 30%.", improvement: "+38 points" },
  { name: "Tarek S.", business: "Furniture Workshop, Mansoura", quote: "Customers kept asking for prices on WhatsApp. Now they can see everything on our site.", improvement: "+52 points" },
];

export function TestimonialsSection() {
  return (
    <section className="py-20 md:py-24 px-6 bg-bg-elevated relative overflow-hidden">
      <GeometricPattern opacity={0.06} />
      <div className="relative max-w-5xl mx-auto text-center">
        <p className="text-text-secondary font-semibold text-xs mb-3 tracking-widest uppercase">Real Results</p>
        <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-12 leading-[1.1]">
          Businesses we have helped show up online.
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {testimonials.map((t, i) => (
            <TiltCard key={t.name}>
              <div className={`card-tilt-inner bg-bg-surface border border-border-subtle rounded-2xl p-6 md:p-8 text-left ${i === 1 ? "md:mt-6" : ""}`}>
                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-3 h-3 text-accent-gold fill-accent-gold" />
                  ))}
                </div>
                <p className="text-text-secondary leading-relaxed text-sm mb-5">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-text-primary text-sm">{t.name}</p>
                    <p className="text-xs text-text-muted">{t.business}</p>
                  </div>
                  <span className="text-xs font-bold bg-score-high/20 text-score-high px-3 py-1 rounded-full">{t.improvement}</span>
                </div>
              </div>
            </TiltCard>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/register" className="inline-flex items-center gap-2 bg-accent-gold text-white px-6 py-3 rounded-xl font-semibold text-sm hover:brightness-110 transition-all">
            ابدأ دلوقتي
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
