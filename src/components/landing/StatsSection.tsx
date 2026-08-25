"use client";
import { useState, useEffect } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { TrendingUp, Users, MessageCircle } from "lucide-react";

const whatsappStats = [
  { label: "Egyptian WhatsApp users", value: "50M+", icon: Users, color: "accent-gold" },
  { label: "Check business profiles daily", value: "8M", icon: TrendingUp, color: "accent-cyan" },
  { label: "Prefer WhatsApp over phone calls", value: "73%", icon: MessageCircle, color: "accent-gold" },
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
      <span className="stat-value animate-count-flash text-6xl md:text-7xl font-bold gradient-text">{count}{suffix}</span>
    </div>
  );
}

export function StatsSection() {
  return (
    <section className="relative z-10 -mt-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="glass rounded-3xl overflow-hidden glow-gold">
          <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border-subtle animate-stagger">
            {whatsappStats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className={`p-8 md:p-10 text-center group hover:bg-white/[0.02] transition-colors ${i === 1 ? "bg-white/[0.02]" : ""}`}>
                  <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl bg-${stat.color}/10 mb-4`}>
                    <Icon className={`w-5 h-5 text-${stat.color}`} />
                  </div>
                  <AnimatedStat target={parseInt(stat.value)} suffix={stat.value.replace(/\d/g, "")} />
                  <p className="text-sm text-text-secondary mt-2 max-w-40 mx-auto">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
