"use client";
import { useEffect, useRef } from "react";
import { HeroSection } from "@/components/landing/HeroSection";
import { StatsSection } from "@/components/landing/StatsSection";
import { ProblemSection } from "@/components/landing/ProblemSection";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { FAASection } from "@/components/landing/FAASection";
import { FinalCTASection } from "@/components/landing/FinalCTASection";
import { FooterSection } from "@/components/landing/FooterSection";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

function Marquee() {
  const items = ["محلات", "مطاعم", "ورش", "عيادات", "مدارس", "شركات", "متاجر", "مكاتب", "معامل", "صيدليات"];
  const doubled = [...items, ...items];
  return (
    <div className="py-6 overflow-hidden bg-bg-elevated border-y border-border-subtle">
      <div className="marquee-track">
        {doubled.map((item, i) => (
          <span key={i} className="text-text-muted/40 text-sm font-bold tracking-widest uppercase whitespace-nowrap">{item}</span>
        ))}
      </div>
    </div>
  );
}

function MouseBlob() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame: number;
    const handleMouse = (e: MouseEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (ref.current) {
          ref.current.style.left = `${e.clientX}px`;
          ref.current.style.top = `${e.clientY}px`;
        }
      });
    };
    window.addEventListener("mousemove", handleMouse);
    return () => {
      window.removeEventListener("mousemove", handleMouse);
      cancelAnimationFrame(frame);
    };
  }, []);

  return <div ref={ref} className="mouse-blob hidden md:block" aria-hidden />;
}

export default function LandingClient() {
  return (
    <>
      <MouseBlob />
      <WhatsAppButton />
      <main>
        <HeroSection />
        <StatsSection />
        <ProblemSection />
        <HowItWorks />
        <Marquee />
        <TestimonialsSection />
        <PricingSection />
        <FAASection />
        <FinalCTASection />
      </main>
      <FooterSection />
    </>
  );
}
