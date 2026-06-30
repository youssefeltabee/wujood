export interface ScanResult {
  mobileScore: number;
  speedScore: number;
  seoScore: number;
  contentScore: number;
  socialScore: number;
  pricingScore: number;
  paymentScore: number;
  aiScore: number;
  trustScore: number;
  contactScore: number;
  rawData: Record<string, unknown>;
}

function hasViewport(html: string): boolean {
  return /<meta[^>]*name=["']viewport["'][^>]*>/i.test(html);
}

function hasResponsiveCSS(html: string): boolean {
  return /@media\s*\(|flex|grid|responsive/i.test(html);
}

function hasLazyLoading(html: string): boolean {
  return /loading=["']lazy["']/i.test(html);
}

function hasMinified(html: string): boolean {
  const lines = html.split("\n").filter((l) => l.trim().length > 0);
  const avgLen = html.length / Math.max(lines.length, 1);
  return avgLen > 200;
}

function hasTitleTag(html: string): boolean {
  return /<title[^>]*>[\s\S]*?<\/title>/i.test(html);
}

function hasMetaDescription(html: string): boolean {
  return /<meta[^>]*name=["']description["'][^>]*>/i.test(html);
}

function hasCanonical(html: string): boolean {
  return /<link[^>]*rel=["']canonical["'][^>]*>/i.test(html);
}

function hasRecentContent(html: string): boolean {
  const currentYear = new Date().getFullYear();
  const recentYears = [currentYear, currentYear - 1, currentYear - 2].join("|");
  return new RegExp(recentYears).test(html);
}

function countSocialLinks(html: string): number {
  const platforms = ["facebook", "linkedin", "twitter", "instagram", "youtube"];
  return platforms.filter((p) => new RegExp(p, "i").test(html)).length;
}

function hasPricing(html: string): boolean {
  return /(price|pricing|plan|package|جنيه|egp|سعر|اشتراك)/i.test(html);
}

function hasPayment(html: string): boolean {
  return /(pay|checkout|fawry|card|دفع|شراء|payment|checkout)/i.test(html);
}

function hasChatbot(html: string): boolean {
  return /(tawk|crisp|intercom|whatsapp.*chat|chatbot|bot|مساعد)/i.test(html);
}

function hasTrustSignals(html: string): boolean {
  return /(testimonial|review|certif|customer.*say|شهادة|تقييم|عميل)/i.test(html);
}

function hasContactInfo(html: string): boolean {
  const phone = /(\+?\d[\d\s\-\(\)]{7,})/.test(html);
  const email = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(html);
  return phone || email;
}

export async function scanUrl(url: string): Promise<ScanResult> {
  const fullUrl = url.startsWith("http") ? url : `https://${url}`;

  let html = "";
  let headers: Record<string, string> = {};
  let fetchSuccess = false;

  try {
    const res = await fetch(fullUrl, {
      signal: AbortSignal.timeout(10000),
      headers: { "User-Agent": "WujoodAudit/1.0" },
    });
    html = await res.text();
    res.headers.forEach((v, k) => { headers[k.toLowerCase()] = v; });
    fetchSuccess = true;
  } catch {
    html = "";
  }

  if (!fetchSuccess || !html) {
    return {
      mobileScore: 0, speedScore: 0, seoScore: 0, contentScore: 0,
      socialScore: 0, pricingScore: 0, paymentScore: 0, aiScore: 0,
      trustScore: 0, contactScore: 0,
      rawData: { error: "Could not fetch URL", url },
    };
  }

  const lower = html.toLowerCase();

  const mobile = (hasViewport(html) ? 5 : 0) + (hasResponsiveCSS(lower) ? 5 : 0);
  const speed = (hasLazyLoading(lower) ? 5 : 0) + (hasMinified(html) ? 5 : 0);
  const seo = (hasTitleTag(html) ? 4 : 0) + (hasMetaDescription(html) ? 3 : 0) + (hasCanonical(html) ? 3 : 0);
  const content = hasRecentContent(html) ? 10 : 0;
  const social = Math.min(countSocialLinks(lower) * 3, 10);
  const pricing = hasPricing(lower) ? 10 : 0;
  const payment = hasPayment(lower) ? 10 : 0;
  const ai = hasChatbot(lower) ? 10 : 0;
  const trust = hasTrustSignals(lower) ? 10 : 0;
  const contact = hasContactInfo(html) ? 10 : 0;

  return {
    mobileScore: mobile,
    speedScore: speed,
    seoScore: seo,
    contentScore: content,
    socialScore: social,
    pricingScore: pricing,
    paymentScore: payment,
    aiScore: ai,
    trustScore: trust,
    contactScore: contact,
    rawData: { url, fetchedAt: new Date().toISOString(), headers },
  };
}
