"use client";

import { useState, useEffect } from "react";

const ar: Record<string, string> = {
  "Your Business Pulse": "نبض عملك",
  "Run a New Audit": "تدقيق جديد",
  "Recent Audits": "آخر التدقيقات",
  Dashboard: "لوحة التحكم",
  Social: "التواصل الاجتماعي",
  Home: "الرئيسية",
  Login: "تسجيل الدخول",
  Register: "إنشاء حساب",
  Logout: "تسجيل الخروج",
  Settings: "الإعدادات",
};

export function useTranslation() {
  const [locale, setLocale] = useState<"en" | "ar">("en");

  useEffect(() => {
    const lang = navigator.language || document.documentElement.lang || "en";
    setLocale(lang.startsWith("ar") ? "ar" : "en");
  }, []);

  return {
    t: (key: string): string => locale === "ar" ? ar[key] || key : key,
    dir: locale === "ar" ? "rtl" as const : "ltr" as const,
    locale,
  };
}
