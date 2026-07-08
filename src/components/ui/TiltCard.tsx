"use client";
import { useRef, useCallback } from "react";

export function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const card = ref.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const tiltX = (y - 0.5) * -8;
    const tiltY = (x - 0.5) * 8;
    const inner = card.querySelector(".card-tilt-inner") as HTMLElement;
    if (inner) {
      inner.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
      inner.style.setProperty("--mx", `${x * 100}%`);
      inner.style.setProperty("--my", `${y * 100}%`);
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    const card = ref.current;
    if (!card) return;
    const inner = card.querySelector(".card-tilt-inner") as HTMLElement;
    if (inner) {
      inner.style.transform = "rotateX(0deg) rotateY(0deg)";
    }
  }, []);

  return (
    <div ref={ref} className={`card-tilt ${className}`} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      {children}
    </div>
  );
}
