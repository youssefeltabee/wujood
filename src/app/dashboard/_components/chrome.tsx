"use client";

import { Card, Skeleton } from "@/components/ui";

// ponytail: dashboard-local page chrome; promoted to components/ui if landing ever needs it

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  action,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
      <div className="min-w-0">
        <p className="section-label mb-2">{eyebrow}</p>
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary truncate">{title}</h1>
        {subtitle && <p className="text-text-secondary mt-1 text-sm md:text-base">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  hint,
  cta,
}: {
  icon: React.ReactNode;
  title: string;
  hint?: string;
  cta?: React.ReactNode;
}) {
  return (
    <div className="card-lux py-14 px-6 text-center">
      <div className="size-14 mx-auto mb-4 rounded-full border border-border-subtle bg-bg-elevated flex items-center justify-center text-text-muted [&_svg]:size-6">
        {icon}
      </div>
      <p className="font-medium text-text-primary">{title}</p>
      {hint && <p className="text-sm text-text-secondary mt-1">{hint}</p>}
      {cta && <div className="mt-5 flex justify-center">{cta}</div>}
    </div>
  );
}

export function StatCard({
  icon,
  label,
  value,
  tone = "text-text-primary",
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  tone?: string;
}) {
  return (
    <Card padding="none" className="card-lux p-5 hover:translate-y-0">
      <div className="flex items-center gap-3 mb-3">
        <div className="size-8 rounded-lg bg-accent-gold/10 text-accent-gold flex items-center justify-center [&_svg]:size-4">
          {icon}
        </div>
        <p className="text-xs text-text-secondary uppercase tracking-widest">{label}</p>
      </div>
      <p className={`stat-value text-3xl font-bold ${tone}`}>{value}</p>
    </Card>
  );
}

export function SkeletonRows({ rows = 4, className = "h-12" }: { rows?: number; className?: string }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }, (_, i) => (
        <Skeleton key={i} variant="card" className={`skeleton !h-auto ${className}`} />
      ))}
    </div>
  );
}
