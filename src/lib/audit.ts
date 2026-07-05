import axios from "axios";
import { JSDOM } from "jsdom";

export interface AuditResult { score: number; categories: AuditCategory[]; summary: string; recommendations: string[]; rawData: Record<string, unknown> }
export interface AuditCategory { name: string; score: number; maxScore: number; details: string; passed: boolean }

const CATEGORIES = ["mobileResponsiveness", "pageSpeed", "seoBasics", "contentFreshness", "socialMediaActivity", "onlinePricing", "onlinePayment", "aiChatbot", "trustSignals", "contactVisibility"] as const;

const CATEGORY_LABELS: Record<string, { ar: string; en: string }> = {
  mobileResponsiveness: { ar: "توافق الجوال", en: "Mobile Responsiveness" },
  pageSpeed: { ar: "سرعة التحميل", en: "Page Load Speed" },
  seoBasics: { ar: "أساسيات SEO", en: "SEO Basics" },
  contentFreshness: { ar: "حداثة المحتوى", en: "Content Freshness" },
  socialMediaActivity: { ar: "نشاط وسائل التواصل", en: "Social Media Activity" },
  onlinePricing: { ar: "التسعير عبر الإنترنت", en: "Online Pricing" },
  onlinePayment: { ar: "الدفع عبر الإنترنت", en: "Online Payment" },
  aiChatbot: { ar: "المساعد الذكي", en: "AI Chatbot" },
  trustSignals: { ar: "مؤشرات الثقة", en: "Trust Signals" },
  contactVisibility: { ar: "وضوح التواصل", en: "Contact Visibility" },
};

export async function runAudit(url: string): Promise<AuditResult> {
  const recommendations: string[] = [];
  const rawData: Record<string, unknown> = {};

  let html: string, dom: JSDOM;
  try {
    const response = await axios.get(url, { timeout: 15000, headers: { "User-Agent": "Wujood-Audit-Bot/1.0" } });
    html = response.data;
    dom = new JSDOM(html);
    rawData.statusCode = response.status;
    rawData.contentLength = html.length;
  } catch {
    return { score: 0, categories: [], summary: "Failed to access the website.", recommendations: ["Ensure the website is publicly accessible."], rawData: { error: "Connection failed" } };
  }

  const document = dom.window.document;
  const categories: AuditCategory[] = [];
  const text = document.body?.textContent || "";

  const hasViewportMeta = document.querySelector('meta[name="viewport"]') !== null;
  const hasResponsiveCSS = html.includes("@media") || html.includes("flex") || html.includes("grid");
  const mobileScore = (hasViewportMeta ? 5 : 0) + (hasResponsiveCSS ? 5 : 0);
  categories.push({ name: CATEGORY_LABELS.mobileResponsiveness.en, score: mobileScore, maxScore: 10, details: hasViewportMeta ? "Viewport meta tag found" : "No viewport meta tag", passed: mobileScore >= 7 });
  if (!hasViewportMeta) recommendations.push("Add a viewport meta tag");

  const hasLazyLoading = html.includes("loading=");
  const hasMinified = html.includes(".min.") || !html.includes("\n  ");
  const speedScore = (hasLazyLoading ? 5 : 0) + (hasMinified ? 5 : 0);
  categories.push({ name: CATEGORY_LABELS.pageSpeed.en, score: speedScore, maxScore: 10, details: hasLazyLoading ? "Lazy loading detected" : "No lazy loading found", passed: speedScore >= 5 });
  if (!hasLazyLoading) recommendations.push("Enable lazy loading");

  const hasTitle = document.querySelector("title") !== null;
  const hasMetaDesc = document.querySelector('meta[name="description"]') !== null;
  const hasCanonical = document.querySelector('link[rel="canonical"]') !== null;
  const hasSitemap = html.includes("sitemap");
  const seoScore = (hasTitle ? 3 : 0) + (hasMetaDesc ? 3 : 0) + (hasCanonical ? 2 : 0) + (hasSitemap ? 2 : 0);
  categories.push({ name: CATEGORY_LABELS.seoBasics.en, score: seoScore, maxScore: 10, details: `Title: ${hasTitle ? "✓" : "✗"}, Description: ${hasMetaDesc ? "✓" : "✗"}`, passed: seoScore >= 6 });
  if (!hasTitle) recommendations.push("Add a title tag");

  const yearMatch = text.match(/202[4-6]/g);
  const recentMentions = yearMatch ? yearMatch.length : 0;
  const freshnessScore = Math.min(recentMentions * 3, 10);
  categories.push({ name: CATEGORY_LABELS.contentFreshness.en, score: freshnessScore, maxScore: 10, details: `Found ${recentMentions} references to recent years`, passed: freshnessScore >= 6 });

  const socialLinks = Array.from(document.querySelectorAll('a[href*="facebook"], a[href*="linkedin"], a[href*="instagram"], a[href*="twitter"]'));
  const socialScore = Math.min(socialLinks.length * 3, 10);
  categories.push({ name: CATEGORY_LABELS.socialMediaActivity.en, score: socialScore, maxScore: 10, details: `Found ${socialLinks.length} social media link(s)`, passed: socialScore >= 6 });

  const pricingKeywords = ["price", "pricing", "plan", "package", "سعر", "أسعار"];
  const hasPricingInfo = pricingKeywords.some((kw) => text.toLowerCase().includes(kw));
  categories.push({ name: CATEGORY_LABELS.onlinePricing.en, score: hasPricingInfo ? 10 : 0, maxScore: 10, details: hasPricingInfo ? "Pricing found" : "No pricing", passed: hasPricingInfo });

  const paymentKeywords = ["pay", "payment", "checkout", "fawry", "credit card", "دفع"];
  const hasPayment = paymentKeywords.some((kw) => text.toLowerCase().includes(kw));
  categories.push({ name: CATEGORY_LABELS.onlinePayment.en, score: hasPayment ? 10 : 0, maxScore: 10, details: hasPayment ? "Payment detected" : "No payment", passed: hasPayment });

  const chatbotIndicators = ['id="chatbot"', 'class="chatbot"', "chatwoot", "tawk", "crisp", "intercom", "whatsapp"];
  const hasChatbot = chatbotIndicators.some((i) => html.includes(i));
  categories.push({ name: CATEGORY_LABELS.aiChatbot.en, score: hasChatbot ? 10 : 0, maxScore: 10, details: hasChatbot ? "Chatbot found" : "No chatbot", passed: hasChatbot });

  const hasTestimonials = text.includes("testimonial") || text.includes("review") || text.includes("توصية");
  const hasCertifications = html.includes("certified") || html.includes("ISO");
  const trustScore = (hasTestimonials ? 5 : 0) + (hasCertifications ? 5 : 0);
  categories.push({ name: CATEGORY_LABELS.trustSignals.en, score: trustScore, maxScore: 10, details: `Testimonials: ${hasTestimonials ? "✓" : "✗"}, Certs: ${hasCertifications ? "✓" : "✗"}`, passed: trustScore >= 5 });

  const contactElements = Array.from(document.querySelectorAll('[href^="tel:"], [href^="mailto:"], a[href*="wa.me"]'));
  const hasContactForm = document.querySelector("form") && (html.includes("contact") || html.includes("اتصل"));
  const contactScore = Math.min(contactElements.length * 4, 5) + (hasContactForm ? 5 : 0);
  categories.push({ name: CATEGORY_LABELS.contactVisibility.en, score: contactScore, maxScore: 10, details: `Contact methods: ${contactElements.length}, Form: ${hasContactForm ? "✓" : "✗"}`, passed: contactScore >= 6 });

  const totalScore = categories.reduce((sum, cat) => sum + cat.score, 0);
  const score = Math.round((totalScore / (categories.length * 10)) * 100);

  let summary: string;
  if (score >= 80) summary = "Your website is in great shape!";
  else if (score >= 60) summary = "Solid foundation but needs improvements.";
  else if (score >= 40) summary = "Needs significant improvements.";
  else summary = "Critically underperforming. Immediate action needed.";

  return { score, categories, summary, recommendations, rawData };
}
