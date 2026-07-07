"use client";

import { Lenis as LenisProvider } from "lenis/react";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  return (
    <LenisProvider root options={{ lerp: 0.08, duration: 1.1 }}>
      {children}
    </LenisProvider>
  );
}
