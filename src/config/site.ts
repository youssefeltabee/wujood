export const siteConfig = {
  name: "Wujood",
  nameAr: "وجود",
  tagline: "Your Business, Online. In EGP. In Arabic.",
  description: "Wujood gives Egyptian SMEs the tools to actually show up online. A website, WhatsApp Business tools, social media management, and an AI chatbot. All in EGP, all in Arabic.",
  url: "https://wujood.app",
  locale: "ar-EG",

  tiers: [
    {
      id: "kashif",
      name: { en: "Kashif", ar: "كاشف" },
      price: 1250,
      currency: "EGP",
      period: "month",
      target: { en: "Sole proprietors and freelancers", ar: "أصحاب المشاريع الفردية والمستقلون" },
      features: [
        { en: "A mobile-friendly website", ar: "موقع متجاوب مع الجوال" },
        { en: "WhatsApp click-to-chat", ar: "واتساب اضغط وتحدث" },
        { en: "1 social media account", ar: "حساب تواصل اجتماعي واحد" },
        { en: "Ghost Audit report", ar: "تقرير التدقيق الرقمي" },
        { en: "Email support", ar: "دعم عبر البريد الإلكتروني" },
      ],
    },
    {
      id: "sane",
      name: { en: "Sane'", ar: "صانع" },
      price: 2500,
      currency: "EGP",
      period: "month",
      target: { en: "Small to medium businesses (5-20 employees)", ar: "الشركات الصغيرة (٥-٢٠ موظف)" },
      popular: true,
      features: [
        { en: "Everything in Kashif", ar: "كل ما في كاشف" },
        { en: "WhatsApp Business API", ar: "واتساب بزنس API" },
        { en: "3 social media accounts", ar: "٣ حسابات تواصل اجتماعي" },
        { en: "Online catalog builder", ar: "بناء كتالوج المنتجات" },
        { en: "Review and trust builder", ar: "نظام المراجعات والثقة" },
        { en: "Priority support", ar: "دعم ذو أولوية" },
      ],
    },
    {
      id: "raed",
      name: { en: "Ra'ed", ar: "رائد" },
      price: 4500,
      currency: "EGP",
      period: "month",
      target: { en: "Growing businesses (20-50 people)", ar: "الشركات المتنامية (٢٠-٥٠ موظف)" },
      features: [
        { en: "Everything in Sane'", ar: "كل ما في صانع" },
        { en: "AI chatbot in Arabic and English", ar: "شات بوت ذكاء اصطناعي بالعربية والإنجليزية" },
        { en: "Unlimited social accounts", ar: "حسابات تواصل اجتماعي غير محدودة" },
        { en: "Custom domain", ar: "نطاق مخصص" },
        { en: "Advanced analytics", ar: "تحليلات متقدمة" },
        { en: "Dedicated account manager", ar: "مدير حساب مخصص" },
      ],
    },
  ],

  auditCategories: [
    { key: "mobileScore", label: { en: "Mobile Responsiveness", ar: "توافق الجوال" }, desc: { en: "Works on phones", ar: "يعمل على الجوال" } },
    { key: "speedScore", label: { en: "Page Load Speed", ar: "سرعة التحميل" }, desc: { en: "Loads fast", ar: "تحميل سريع" } },
    { key: "seoScore", label: { en: "SEO Basics", ar: "أساسيات SEO" }, desc: { en: "Shows up on Google", ar: "ظهور في جوجل" } },
    { key: "contentScore", label: { en: "Content Freshness", ar: "حداثة المحتوى" }, desc: { en: "Updated recently", ar: "محتوى محدث" } },
    { key: "socialScore", label: { en: "Social Media Activity", ar: "نشاط التواصل الاجتماعي" }, desc: { en: "Active on social", ar: "نشط على السوشيال ميديا" } },
    { key: "pricingScore", label: { en: "Pricing Visibility", ar: "وضوح الأسعار" }, desc: { en: "Prices are clear", ar: "الأسعار واضحة" } },
    { key: "paymentScore", label: { en: "Online Payment", ar: "الدفع الإلكتروني" }, desc: { en: "Accepts online payments", ar: "يقبل الدفع أونلاين" } },
    { key: "aiScore", label: { en: "AI / Chatbot", ar: "الذكاء الاصطناعي" }, desc: { en: "Has a chatbot", ar: "يوجد شات بوت" } },
    { key: "trustScore", label: { en: "Trust Signals", ar: "إشارات الثقة" }, desc: { en: "Reviews and testimonials", ar: "تقييمات وشهادات" } },
    { key: "contactScore", label: { en: "Contact Visibility", ar: "وضوح الاتصال" }, desc: { en: "Easy to reach", ar: "سهولة التواصل" } },
  ] as const,

  ghostLevels: [
    { min: 0, max: 25, label: { en: "Digital Ghost", ar: "شبح رقمي" }, color: "bg-red-500" },
    { min: 26, max: 50, label: { en: "Faint Signal", ar: "إشارة ضعيفة" }, color: "bg-orange-500" },
    { min: 51, max: 75, label: { en: "Becoming Visible", ar: "في طور الظهور" }, color: "bg-yellow-500" },
    { min: 76, max: 100, label: { en: "Digitally Present", ar: "حاضر رقمياً" }, color: "bg-green-500" },
  ],
};

export type Locale = "en" | "ar";
export type TierId = "kashif" | "sane" | "raed";
