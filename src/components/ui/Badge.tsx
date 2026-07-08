"use client";

import { cn } from "@/lib/utils";

const variants = {
  default: "bg-bg-elevated text-text-secondary border border-border-subtle",
  success: "bg-score-high/10 text-score-high border border-score-high/20",
  warning: "bg-score-mid/10 text-score-mid border border-score-mid/20",
  danger: "bg-score-low/10 text-score-low border border-score-low/20",
  info: "bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20",
  gold: "bg-accent-gold/10 text-accent-gold border border-accent-gold/20",
};

const sizes = {
  sm: "px-2 py-0.5 text-[10px]",
  md: "px-2.5 py-1 text-xs",
};

interface BadgeProps {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  className?: string;
  children: React.ReactNode;
}

function Badge({ variant = "default", size = "md", className, children }: BadgeProps) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full font-medium", variants[variant], sizes[size], className)}>
      {children}
    </span>
  );
}
Badge.displayName = "Badge";

export { Badge };
export type { BadgeProps };
