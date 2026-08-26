"use client";
import { Check, TriangleAlert } from "lucide-react";
import { useLocale } from "@/lib/i18n";

// ponytail: decorative product preview — static mock, real audits live in /audit flow
const CHECKS = [
  { key: "hero.mock.check1", ok: true },
  { key: "hero.mock.check2", ok: true },
  { key: "hero.mock.check3", ok: true },
  { key: "hero.mock.check4", ok: false },
] as const;

export function HeroMockup() {
  const { t } = useLocale();
  const score = 74;
  const circumference = 2 * Math.PI * 52;

  return (
    <div className="relative">
      <div className="card-lux glass-panel rounded-3xl p-6 md:p-7 grain">
        <div className="flex items-center justify-between mb-6">
          <span className="text-xs text-text-muted font-medium tracking-wide" dir="ltr">cairocafe.example</span>
          <span className="text-[11px] text-text-muted">{t("hero.mock.caption")}</span>
        </div>

        <div className="flex items-center gap-5 mb-6">
          <div className="relative w-28 h-28 shrink-0">
            <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
              <circle cx="60" cy="60" r="52" fill="none" stroke="var(--color-border-subtle)" strokeWidth="9" />
              <circle
                cx="60" cy="60" r="52" fill="none"
                stroke="url(#mock-gold)" strokeWidth="9" strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - score / 100)}
              />
              <defs>
                <linearGradient id="mock-gold" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#D4A853" />
                  <stop offset="100%" stopColor="#00C9B7" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="stat-value text-3xl font-bold gradient-text">{score}</span>
              <span className="text-[10px] text-text-muted">/ 100</span>
            </div>
          </div>
          <div>
            <p className="text-sm text-text-secondary mb-1">{t("hero.mock.scoreLabel")}</p>
            <p className="text-2xl font-bold leading-tight">
              <span className="gradient-text">+38</span>
            </p>
          </div>
        </div>

        <ul className="space-y-2.5">
          {CHECKS.map(({ key, ok }) => (
            <li key={key} className="flex items-center gap-3 rounded-xl bg-white/[0.02] border border-border-subtle/60 px-3.5 py-2.5">
              {ok ? (
                <Check className="w-4 h-4 text-success shrink-0" />
              ) : (
                <TriangleAlert className="w-4 h-4 text-warning shrink-0" />
              )}
              <span className={`text-sm ${ok ? "text-text-secondary" : "text-text-primary font-medium"}`}>{t(key)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
