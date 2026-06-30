export const siteConfig = {
  name: "Wujood",
  tagline: "From Digital Ghost to Digital Presence",
  description: "All-in-one digital presence platform for Egyptian SMEs. Website builder, WhatsApp CRM, social media management, and AI chatbot — in EGP, in Arabic.",
  url: "https://wujood.app",
  locale: "ar-EG",

  tiers: [
    {
      id: "kashif",
      name: { en: "Kashif", ar: "كاشف" },
      price: 1250,
      currency: "EGP",
      period: "month",
      target: { en: "Sole proprietors, freelancers", ar: "أصحاب المشاريع الفردية والمستقلون" },
      features: [
        { en: "Mobile-responsive website", ar: "موقع متجاوب مع الجوال" },
        { en: "Basic WhatsApp integration", ar: "دمج واتساب أساسي" },
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
      target: { en: "SMEs (5-20 employees)", ar: "الشركات الصغيرة (٥-٢٠ موظف)" },
      popular: true,
      features: [
        { en: "Everything in Kashif", ar: "كل ما في كاشف" },
        { en: "WhatsApp Business API", ar: "واتساب بزنس API" },
        { en: "3 social media accounts", ar: "٣ حسابات تواصل اجتماعي" },
        { en: "Online catalog builder", ar: "بناء كتالوج المنتجات" },
        { en: "Review & trust builder", ar: "نظام المراجعات والثقة" },
        { en: "Priority support", ar: "دعم ذو أولوية" },
      ],
    },
    {
      id: "raed",
      name: { en: "Ra'ed", ar: "رائد" },
      price: 4500,
      currency: "EGP",
      period: "month",
      target: { en: "Growing businesses (20-50)", ar: "الشركات المتنامية (٢٠-٥٠ موظف)" },
      features: [
        { en: "Everything in Sane'", ar: "كل ما في صانع" },
        { en: "AI chatbot (Arabic/English)", ar: "شات بوت ذكاء اصطناعي" },
        { en: "Unlimited social accounts", ar: "حسابات تواصل اجتماعي غير محدودة" },
        { en: "Custom domain", ar: "نطاق مخصص" },
        { en: "Advanced analytics", ar: "تحليلات متقدمة" },
        { en: "Dedicated account manager", ar: "مدير حساب مخصص" },
      ],
    },
  ],

  auditCategories: [
    { key: "mobileScore", label: { en: "Mobile Responsiveness", ar: "توافق الجوال" }, desc: { en: "Viewport meta tag, responsive CSS", ar: "علامة viewport، CSS متجاوب" } },
    { key: "speedScore", label: { en: "Page Load Speed", ar: "سرعة التحميل" }, desc: { en: "Lazy loading, minified assets", ar: "التحميل البطيء، تحسين الأصول" } },
    { key: "seoScore", label: { en: "SEO Basics", ar: "أساسيات SEO" }, desc: { en: "Title tag, meta description, sitemap", ar: "علامة العنوان، الوصف، خريطة الموقع" } },
    { key: "contentScore", label: { en: "Content Freshness", ar: "حداثة المحتوى" }, desc: { en: "Recent updates, blog activity", ar: "التحديثات الحديثة، نشاط المدونة" } },
    { key: "socialScore", label: { en: "Social Media Activity", ar: "نشاط التواصل الاجتماعي" }, desc: { en: "Links to active social profiles", ar: "روابط لحسابات نشطة" } },
    { key: "pricingScore", label: { en: "Pricing Visibility", ar: "وضوح الأسعار" }, desc: { en: "Clear pricing on website", ar: "أسعار واضحة على الموقع" } },
    { key: "paymentScore", label: { en: "Online Payment", ar: "الدفع الإلكتروني" }, desc: { en: "Online payment options", ar: "خيارات الدفع عبر الإنترنت" } },
    { key: "aiScore", label: { en: "AI / Chatbot", ar: "الذكاء الاصطناعي" }, desc: { en: "Chatbot or AI assistant", ar: "مساعد ذكاء اصطناعي" } },
    { key: "trustScore", label: { en: "Trust Signals", ar: "إشارات الثقة" }, desc: { en: "Testimonials, certifications, reviews", ar: "الشهادات، التقييمات" } },
    { key: "contactScore", label: { en: "Contact Visibility", ar: "وضوح الاتصال" }, desc: { en: "Phone, email, WhatsApp", ar: "الهاتف، البريد، واتساب" } },
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
