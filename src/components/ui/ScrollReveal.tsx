"use client";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export function RevealSection({ children, delay = 1, className = "", ...props }: { children: React.ReactNode; delay?: number; className?: string } & React.HTMLAttributes<HTMLDivElement>) {
  const { ref, visible } = useScrollReveal<HTMLDivElement>();
  return (
    <div ref={ref} className={`reveal reveal-delay-${delay} ${visible ? "visible" : ""} ${className}`} {...props}>
      {children}
    </div>
  );
}
