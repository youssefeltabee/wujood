"use client";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Check } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { AuditForm } from "@/components/audit/AuditForm";
import { ScoreOrb } from "@/components/hero/ScoreOrb";

const ThreeScene = dynamic(() => import("@/components/hero/ThreeScene").then((m) => ({ default: m.ThreeScene })), { ssr: false });

const features = ["WhatsApp click-to-chat", "Mobile-friendly site", "Social media setup"];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pb-24 md:pb-32">
      <div className="absolute top-1/4 -left-24 w-96 h-96 rounded-full bg-accent-gold/5 blur-3xl animate-blob" />
      <div className="absolute bottom-1/4 -right-24 w-80 h-80 rounded-full bg-accent-cyan/5 blur-3xl animate-blob-2" />
      <div className="relative w-full max-w-6xl mx-auto px-6 pt-12 md:pt-16">
        <div className="flex items-start justify-between mb-12 md:mb-16">
          <Logo />
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-text-muted hover:text-text-primary transition-colors">Login</Link>
            <Link href="/register" className="text-sm bg-accent-gold text-white px-5 py-2 rounded-lg hover:brightness-110 transition-all font-medium">ابدأ دلوقتي</Link>
          </div>
        </div>
        <div className="grid md:grid-cols-5 gap-8 items-center">
          <div className="md:col-span-3 md:pr-8">
            <div className="flex items-center gap-3 mb-5">
              <span className="bg-accent-gold/10 text-accent-gold text-xs font-semibold px-3 py-1 rounded-full tracking-wide">Free — 30 seconds</span>
              <span className="bg-accent-cyan/10 text-accent-cyan text-xs font-semibold px-3 py-1 rounded-full tracking-wide">WhatsApp Included</span>
            </div>
            <h1 className="text-[clamp(2.5rem,8vw,5rem)] md:text-7xl lg:text-8xl font-bold text-text-primary leading-[1.02] mb-5">
              Your customers are searching for you on WhatsApp right now.
            </h1>
            <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6 max-w-lg">
              Can they find your prices, your hours, your location? If your website is outdated or your social media went quiet months ago, you are leaving money on the table. Wujood gives you a real online presence. From 1,250 EGP a month.
            </p>
            <div className="max-w-md">
              <AuditForm />
            </div>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
              {features.map((f) => (
                <span key={f} className="text-sm text-text-secondary flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-accent-gold" />
                  {f}
                </span>
              ))}
            </div>
          </div>
          <div className="md:col-span-2 hidden md:block md:-mr-16 lg:-mr-28">
            <ThreeScene>
              <ScoreOrb />
            </ThreeScene>
          </div>
        </div>
      </div>
    </section>
  );
}
