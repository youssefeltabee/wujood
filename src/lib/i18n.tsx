"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

type Locale = "en" | "ar";

const dict: Record<Locale, Record<string, string>> = {
  en: {
    "nav.login": "Login",
    "nav.cta": "Start Now",
    "nav.eyebrow": "Wujood • Digital Presence Platform",
    "hero.badge.free": "Free • 30s Audit",
    "hero.badge.whatsapp": "WhatsApp Included",
    "hero.heading": "Your customers are searching for you",
    "hero.heading.accent": "on WhatsApp right now.",
    "hero.subtext": "Can they find your prices, your hours, your location? If your website is outdated or your social media went quiet months ago, you are leaving money on the table. Wujood gives you a real online presence. From 1,250 EGP a month.",
    "hero.feature.whatsapp": "WhatsApp click-to-chat",
    "hero.feature.mobile": "Mobile-friendly site",
    "hero.feature.social": "Social media setup",
    "hero.mock.scoreLabel": "Digital Presence Score",
    "hero.mock.check1": "Clear prices published",
    "hero.mock.check2": "WhatsApp connected to site",
    "hero.mock.check3": "Mobile-friendly pages",
    "hero.mock.check4": "Social media active this month",
    "hero.mock.caption": "Real report, 30 seconds",
    "tab.problem": "The Problem",
    "tab.how-it-works": "How It Works",
    "tab.features": "Features",
    "tab.testimonials": "Testimonials",
    "tab.pricing": "Pricing",
    "section.problem.label": "The Problem",
    "section.problem.heading": "8 out of 10 Egyptian SMEs are invisible online.",
    "section.problem.body": "That is roughly {amount} in missed business every year. Not because their product is bad — because customers could not find them when they needed them.",
    "section.problem.pain.1": "No pricing on their website",
    "section.problem.pain.2": "Social media dormant for months",
    "section.problem.pain.3": "No online payment options",
    "section.problem.pain.4": "Hard to find on Google",
    "section.problem.stat": "of Egyptian SMEs have no real online presence",
    "section.problem.source": "Based on an analysis of 500 Egyptian business websites",
    "section.how-it-works.label": "How It Works",
    "section.how-it-works.heading": "Three steps to a real online presence.",
    "section.how-it-works.step1.title": "We scan your business",
    "section.how-it-works.step1.desc": "Enter your website URL. Our audit checks 10 categories: mobile readiness, speed, SEO, social media activity, pricing, payments, and more.",
    "section.how-it-works.step2.title": "You get your score",
    "section.how-it-works.step2.desc": "A clear 0-100 Digital Presence Score. You will see exactly what is missing and what is working. No jargon, no fluff.",
    "section.how-it-works.step3.title": "We build what you need",
    "section.how-it-works.step3.desc": "Pick a plan. We set up your website, connect your WhatsApp, link your social media, and get you visible. You focus on running your business.",
    "section.testimonials.label": "Real Results",
    "section.testimonials.heading": "Businesses we have helped show up online.",
    "section.testimonials.cta": "Start Now",
    "section.pricing.label": "Pricing",
    "section.pricing.heading": "Plans for every stage of business.",
    "section.pricing.subtext": "All prices in EGP. No hidden fees. Cancel anytime.",
    "section.pricing.annual": "Annual billing: 10 months for 12 (17% off). 7-day free trial on all plans.",
    "section.pricing.most-popular": "Most Popular",
    "section.pricing.see-details": "See Details",
    "section.pricing.start-now": "Start Now",
    "section.pricing.month": "EGP/month",
    "section.pricing.modal.cta": "Start Now — {price} EGP/month",
    "section.pricing.modal.advisor": "Talk to an Advisor",
    "section.pricing.modal.for": "Who is {name} for?",
    "section.pricing.modal.annual": "Annual billing saves 17% • Pay in 3 installments available",
    "section.faq.label": "FAQ",
    "section.faq.heading": "Common questions.",
    "section.faq.q1": "Do I need technical skills to use Wujood?",
    "section.faq.a1": "No. We set everything up for you. You just tell us what you need and we handle the rest.",
    "section.faq.q2": "Can I cancel anytime?",
    "section.faq.a2": "Yes. No contracts, no early termination fees. You keep what we built.",
    "section.faq.q3": "What if I already have a website?",
    "section.faq.a3": "We can work with your existing site or build a new one. Start with a free audit to see where you stand.",
    "section.faq.q4": "Do you work with businesses outside Cairo?",
    "section.faq.a4": "We work with Egyptian businesses everywhere. Our entire platform is remote.",
    "section.faq.q5": "Is support available in Arabic?",
    "section.faq.a5": "Yes. Our team speaks Arabic and English. Support is included in every plan.",
    "section.cta.label": "Start Free — 30 Seconds",
    "section.cta.heading": "See where your business stands.",
    "section.cta.subtext": "Enter your website URL. Get a free Digital Presence Score and a full breakdown of what is missing. It takes 30 seconds.",
    "footer.tagline": "Website builder, WhatsApp CRM, social media management, and AI chatbot for Egyptian SMEs. From 1,250 EGP a month.",
    "footer.quick-links": "Quick Links",
    "footer.contact": "Contact",
    "footer.privacy": "Privacy",
    "footer.terms": "Terms",
    "footer.home": "Home",
    "footer.pricing": "Pricing",
    "footer.how-it-works": "How It Works",
    "footer.faq": "FAQ",
    "marquee.items": "Shops|Restaurants|Workshops|Clinics|Schools|Companies|Stores|Offices|Labs|Pharmacies",
  },
  ar: {
    "nav.login": "تسجيل الدخول",
    "nav.cta": "ابدأ دلوقتي",
    "nav.eyebrow": "وجود • منصة الحضور الرقمي",
    "hero.badge.free": "مجاني • تدقيق 30 ثانية",
    "hero.badge.whatsapp": "واتساب مشمول",
    "hero.heading": "عملاؤك بيدوروا عليك",
    "hero.heading.accent": "على WhatsApp دلوقتي.",
    "hero.subtext": "هل بيلاقوا أسعارك، مواعيدك، مكانك؟ لو موقعك قديم أو وسائل التواصل بتاعتك صامتة من شهور، أنت بتخسر فلوس. Wujood بتديوك presence حقيقي online. من 1,250 ج.م في الشهر.",
    "hero.feature.whatsapp": "واتساب click-to-chat",
    "hero.feature.mobile": "موقع متوافق مع الموبايل",
    "hero.feature.social": "إعداد وسائل التواصل",
    "hero.mock.scoreLabel": "درجة الحضور الرقمي",
    "hero.mock.check1": "أسعارك واضحة على موقعك",
    "hero.mock.check2": "واتساب مربوط بموقعك",
    "hero.mock.check3": "صفحات متوافقة مع الموبايل",
    "hero.mock.check4": "سوشيال ميديا نشطة الشهر ده",
    "hero.mock.caption": "تقرير حقيقي في 30 ثانية",
    "tab.problem": "المشكلة",
    "tab.how-it-works": "كيف يعمل",
    "tab.features": "المميزات",
    "tab.testimonials": "آراء العملاء",
    "tab.pricing": "الأسعار",
    "section.problem.label": "المشكلة",
    "section.problem.heading": "8 من كل 10 شركات صغيرة مصرية غير مرئية على الإنترنت.",
    "section.problem.body": "ده تقريباً {amount} فرص ضائعة كل سنة. مش لأن منتجهم وحش — لكن لأن العملاء ملحقوش يلاقوهم.",
    "section.problem.pain.1": "مفيش أسعار على موقعهم",
    "section.problem.pain.2": "وسائل التواصل نائمة من شهور",
    "section.problem.pain.3": "مفيش خيارات دفع online",
    "section.problem.pain.4": "صعب تلاقيهم على Google",
    "section.problem.stat": "من الشركات الصغيرة المصرية معندهاش وجود online حقيقي",
    "section.problem.source": "بناءً على تحليل 500 موقع لشركات مصرية",
    "section.how-it-works.label": "كيف يعمل",
    "section.how-it-works.heading": "ثلاث خطوات لوجود online حقيقي.",
    "section.how-it-works.step1.title": "بنفحص نشاطك التجاري",
    "section.how-it-works.step1.desc": "ادخل رابط موقعك. التدقيق بتاعنا بيكشف 10 مجالات: التوافق مع الموبايل، السرعة، SEO، نشاط وسائل التواصل، الأسعار، الدفع، وأكثر.",
    "section.how-it-works.step2.title": "بتاخد درجتك",
    "section.how-it-works.step2.desc": "درجة حضور رقمي واضحة من 0 لـ 100. هتشوف بالضبط إيه ناقص وإيه شغال. من غير تعقيد.",
    "section.how-it-works.step3.title": "بنيبني إيه محتاج",
    "section.how-it-works.step3.desc": "اختار خطة. احنا بننشئ موقعك، ونربط واتسابك، ونوصل حساباتك، ونخليك visible. انت ركز على شغلك.",
    "section.testimonials.label": "نتائج حقيقية",
    "section.testimonials.heading": "شركات ساعدناها تظهر online.",
    "section.testimonials.cta": "ابدأ دلوقتي",
    "section.pricing.label": "الأسعار",
    "section.pricing.heading": "خطط تناسب كل مرحلة.",
    "section.pricing.subtext": "كل الأسعار بالجنيه المصري. مفيش رسوم خفية. إلغاء في أي وقت.",
    "section.pricing.annual": "الفوترة السنوية: 10 شهور مقابل 12 (توفير 17٪). تجربة مجانية 7 أيام على كل الخطط.",
    "section.pricing.most-popular": "الأكثر طلباً",
    "section.pricing.see-details": "عرض التفاصيل",
    "section.pricing.start-now": "ابدأ دلوقتي",
    "section.pricing.month": "ج.م/الشهر",
    "section.pricing.modal.cta": "ابدأ دلوقتي — {price} ج.م/الشهر",
    "section.pricing.modal.advisor": "تكلم مع مستشار",
    "section.pricing.modal.for": "الخطة مناسبة لـ {name}",
    "section.pricing.modal.annual": "الفوترة السنوية توفر 17٪ • تقسيط على 3 دفعات متاح",
    "section.faq.label": "الأسئلة الشائعة",
    "section.faq.heading": "أسئلة شائعة.",
    "section.faq.q1": "هل أحتاج مهارات تقنية لاستخدام Wujood؟",
    "section.faq.a1": "لا. احنا بنضبطلك كل حاجة. أنت بس قولنا محتاج إيه واحنا نعمل الباقي.",
    "section.faq.q2": "هل أقدر ألغي في أي وقت؟",
    "section.faq.a2": "أيوه. مفيش عقود ولا رسوم إلغاء. كل اللي بنيناه يفضل معاك.",
    "section.faq.q3": "لو عندي موقع بالفعل؟",
    "section.faq.a3": "نقدر نشتغل على موقعك الحالي أو نبني واحد جديد. ابدأ بتدقيق مجاني تشوف وضعك فين.",
    "section.faq.q4": "بتشتغلوا مع بره القاهرة؟",
    "section.faq.a4": "بنشتغل مع شركات مصرية في كل مكان. المنصة كلها remote.",
    "section.faq.q5": "الدعم متوفر بالعربي؟",
    "section.faq.a5": "أيوه. فريقنا بيتكلم عربي وإنجليزي. الدعم مشمول في كل الخطط.",
    "section.cta.label": "ابدأ مجانًا — 30 ثانية",
    "section.cta.heading": "شوف نشاطك التجاري فين.",
    "section.cta.subtext": "ادخل رابط موقعك. احصل على درجة حضور رقمي مجانية وتقرير كامل بإيه الناقص. بتاخد 30 ثانية.",
    "footer.tagline": "منشئ مواقع، واتساب CRM، إدارة وسائل التواصل، و chatbot ذكي للشركات الصغيرة المصرية. من 1,250 ج.م في الشهر.",
    "footer.quick-links": "روابط سريعة",
    "footer.contact": "اتصل بنا",
    "footer.privacy": "الخصوصية",
    "footer.terms": "الشروط",
    "footer.home": "الرئيسية",
    "footer.pricing": "الأسعار",
    "footer.how-it-works": "كيف يعمل",
    "footer.faq": "الأسئلة الشائعة",
    "marquee.items": "محلات|مطاعم|ورش|عيادات|مدارس|شركات|متاجر|مكاتب|معامل|صيدليات",
  },
};

const LocaleCtx = createContext<{
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string, params?: Record<string, string>) => string;
  dir: "ltr" | "rtl";
} | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("ar");

  useEffect(() => {
    const stored = localStorage.getItem("wujood-locale") as Locale | null;
    if (stored === "en" || stored === "ar") {
      // ponytail: deferred out of the sync effect body; same-tick restore, SSR-safe (no hydration mismatch)
      queueMicrotask(() => setLocaleState(stored));
    }
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    localStorage.setItem("wujood-locale", l);
    document.documentElement.lang = l;
    document.documentElement.dir = l === "ar" ? "rtl" : "ltr";
  }, []);

  const t = useCallback((key: string, params?: Record<string, string>): string => {
    let val = dict[locale][key] ?? key;
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        val = val.replace(`{${k}}`, v);
      }
    }
    return val;
  }, [locale]);

  return (
    <LocaleCtx.Provider value={{ locale, setLocale, t, dir: locale === "ar" ? "rtl" : "ltr" }}>
      {children}
    </LocaleCtx.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleCtx);
  if (!ctx) return { locale: "ar" as const, setLocale: () => {}, t: (key: string, params?: Record<string, string>) => { let val = dict.ar[key] ?? key; if (params) for (const [k, v] of Object.entries(params)) val = val.replace(`{${k}}`, v); return val; }, dir: "rtl" as const };
  return ctx;
}

export function LanguageSwitch() {
  const { locale, setLocale } = useLocale();
  return (
    <button
      onClick={() => setLocale(locale === "ar" ? "en" : "ar")}
      className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-border-subtle text-text-muted hover:text-text-primary hover:border-accent-gold transition-all"
      aria-label={locale === "ar" ? "Switch to English" : "التبديل إلى العربية"}
    >
      {locale === "ar" ? "EN" : "عربي"}
    </button>
  );
}
