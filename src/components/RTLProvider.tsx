"use client";

import { useEffect } from "react";
import { useLocale } from "@/lib/i18n";

export function RTLProvider({ children }: { children: React.ReactNode }) {
  const { dir } = useLocale();

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = dir === "rtl" ? "ar" : "en";
  }, [dir]);

  return <>{children}</>;
}