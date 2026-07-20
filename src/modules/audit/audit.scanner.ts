import { MemoryCache } from "@/lib/cache";
import { isPrivateIP } from "@/lib/utils";

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

const URL_CACHE_MS = 30_000;
const DOMAIN_RATE_LIMIT_MS = 10_000;
const scanCache = new MemoryCache<ScanResult>(URL_CACHE_MS);
const domainTimestamps = new Map<string, number>();

function extractDomain(url: string): string {
  try { return new URL(url).hostname; }
  catch { return url; }
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

function minificationScore(html: string): number {
  const lines = html.split("\n").filter((l) => l.trim());
  if (lines.length <= 3) return 10;
  if (/sourceMappingURL/i.test(html)) return 10;
  const hasIndent = /^\s+</m.test(html);
  const hasComments = /<!--[\s\S]*?-->/i.test(html);
  if (!hasIndent && hasComments) return 5;
  return 0;
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

function contentFreshnessScore(html: string): number {
  const currentYear = new Date().getFullYear();
  const year = String(currentYear);
  const patterns = [
    new RegExp(`(?:©|copyright|last updated|updated|modified|published|posted)\\s*(?::|,)?\\s*${year}`, "i"),
    new RegExp(`(?:${year})\\s*(?:©|copyright|all rights reserved)`, "i"),
    new RegExp(`datetime=["']\\d{4}`),
    new RegExp(`>\\s*${year}\\s*<`),
  ];
  return Math.min(patterns.filter((p) => p.test(html)).length * 4, 10);
}

function detectJsRendered(html: string): boolean {
  const rootDiv = /<div[^>]*id=["'](root|app)["'][^>]*>/i.test(html);
  const emptyRoot = /<div[^>]*id=["'](root|app)["'][^>]*>\s*<\/div>/i.test(html);
  const hasFrameworkInit = /createRoot|ReactDOM|createApp|\.mount\(|\.\$mount\(/i.test(html);
  const bodyMatch = html.match(/<body[\s\S]*?>([\s\S]*)<\/body>/i);
  const bodyText = bodyMatch
    ? bodyMatch[1].replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<[^>]+>/g, "").trim()
    : "";
  return (rootDiv && emptyRoot) || (rootDiv && hasFrameworkInit) || (hasFrameworkInit && bodyText.length < 50);
}

function countSocialLinks(html: string): number {
  return ["facebook", "linkedin", "twitter", "instagram", "youtube"]
    .filter((p) => new RegExp(p, "i").test(html)).length;
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
  const body = html.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<style[\s\S]*?<\/style>/gi, "");
  const egyptianPhone = /(\+20[\s\-]?1[0-2]\d[\s\-]?\d{3}[\s\-]?\d{4}|01[0-2]\d{8})/.test(body);
  const email = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(body);
  return egyptianPhone || email;
}

export async function scanUrl(url: string): Promise<ScanResult> {
  const fullUrl = url.startsWith("http") ? url : `https://${url}`;
  const cacheKey = fullUrl.toLowerCase().trim();
  const domain = extractDomain(fullUrl);

  const cached = scanCache.get(cacheKey);
  if (cached) return cached;

  const lastDomainScan = domainTimestamps.get(domain);
  if (lastDomainScan && Date.now() - lastDomainScan < DOMAIN_RATE_LIMIT_MS) {
    return {
      mobileScore: 0, speedScore: 0, seoScore: 0, contentScore: 0,
      socialScore: 0, pricingScore: 0, paymentScore: 0, aiScore: 0,
      trustScore: 0, contactScore: 0,
      rawData: { error: `Rate limited. Wait ${Math.ceil((DOMAIN_RATE_LIMIT_MS - (Date.now() - lastDomainScan)) / 1000)}s.`, url },
    };
  }

  domainTimestamps.set(domain, Date.now());

  const urlObj = new URL(fullUrl);
  const hostname = urlObj.hostname;
  if (hostname === "localhost" || hostname === "0.0.0.0" || /^\d+\.\d+\.\d+\.\d+$/.test(hostname) && isPrivateIP(hostname)) {
    return {
      mobileScore: 0, speedScore: 0, seoScore: 0, contentScore: 0,
      socialScore: 0, pricingScore: 0, paymentScore: 0, aiScore: 0,
      trustScore: 0, contactScore: 0,
      rawData: { error: "Invalid URL", url },
    };
  }

  let html = "";
  const headers: Record<string, string> = {};
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
  const result: ScanResult = {
    mobileScore: (hasViewport(html) ? 5 : 0) + (hasResponsiveCSS(lower) ? 5 : 0),
    speedScore: Math.min((hasLazyLoading(lower) ? 3 : 0) + minificationScore(html), 10),
    seoScore: (hasTitleTag(html) ? 4 : 0) + (hasMetaDescription(html) ? 3 : 0) + (hasCanonical(html) ? 3 : 0),
    contentScore: contentFreshnessScore(html),
    socialScore: Math.min(countSocialLinks(lower) * 3, 10),
    pricingScore: hasPricing(lower) ? 10 : 0,
    paymentScore: hasPayment(lower) ? 10 : 0,
    aiScore: hasChatbot(lower) ? 10 : 0,
    trustScore: hasTrustSignals(lower) ? 10 : 0,
    contactScore: hasContactInfo(html) ? 10 : 0,
    rawData: { url, fetchedAt: new Date().toISOString(), headers, jsRendered: detectJsRendered(html) },
  };

  scanCache.set(cacheKey, result);
  return result;
}
