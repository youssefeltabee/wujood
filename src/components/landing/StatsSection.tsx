"use client";
import { useState, useEffect } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const whatsappStats = [
  { label: "Egyptian WhatsApp users", value: "50M+" },
  { label: "Check business profiles daily", value: "8M" },
  { label: "Prefer WhatsApp over phone calls", value: "73%" },
];

function AnimatedStat({ target, suffix = "" }: { target: number; suffix?: string }) {
  const { ref, visible } = useScrollReveal<HTMLDivElement>();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const duration = 1500;
    const step = 16;
    const totalSteps = duration / step;
    const increment = target / totalSteps;
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, step);
    return () => clearInterval(timer);
  }, [visible, target]);

  return (
    <div ref={ref}>
      <span className="text-8xl font-bold text-accent-gold">{count}{suffix}</span>
    </div>
  );
}

export function StatsSection() {
  return (
    <section className="relative z-10 -mt-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-bg-surface rounded-3xl border border-border-subtle overflow-hidden">
          <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border-subtle">
            {whatsappStats.map((stat, i) => (
              <div key={stat.label} className={`p-8 md:p-10 text-center ${i === 1 ? "bg-bg-elevated" : ""}`}>
                <AnimatedStat target={parseInt(stat.value)} suffix={stat.value.replace(/\d/g, "")} />
                <p className="text-sm text-text-secondary mt-1 max-w-40 mx-auto">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
