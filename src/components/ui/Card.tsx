"use client";

import { cn } from "@/lib/utils";

const variants = {
  elevated: "bg-bg-surface shadow-lg shadow-black/20",
  surface: "bg-bg-elevated",
  bordered: "border border-border-subtle bg-transparent",
  interactive: "bg-bg-elevated border border-border-subtle hover:border-accent-gold/30 transition-colors duration-200 cursor-pointer",
};

const paddings = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

interface CardProps {
  variant?: keyof typeof variants;
  padding?: keyof typeof paddings;
  className?: string;
  children: React.ReactNode;
  as?: "div" | "section" | "article" | "aside";
}

function Card({ variant = "elevated", padding = "md", className, children, as: Tag = "div" }: CardProps) {
  return (
    <Tag className={cn("rounded-xl", variants[variant], paddings[padding], className)}>
      {children}
    </Tag>
  );
}

function CardHeader({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("mb-4", className)}>{children}</div>;
}

function CardBody({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn(className)}>{children}</div>;
}

function CardFooter({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("mt-4 pt-4 border-t border-border-subtle", className)}>{children}</div>;
}

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;
Card.displayName = "Card";
CardHeader.displayName = "Card.Header";
CardBody.displayName = "Card.Body";
CardFooter.displayName = "Card.Footer";

export { Card };
export type { CardProps };
