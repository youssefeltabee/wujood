import { lookup as dnsLookup } from "dns/promises";
import type { LookupFunction } from "net";
import { Agent, fetch as undiciFetch } from "undici";
import { MemoryCache } from "@/lib/cache";
import { validateUrl, containsPrivateIP } from "@/lib/url-validation";

const MAX_RESPONSE_BYTES = 5 * 1024 * 1024;

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
  preLaunchScore: number;
  rawData: Record<string, unknown>;
}

export interface PreLaunchChecks {
  uniquePageTitles: boolean;
  metaDescriptions: boolean;
  socialShareImg: boolean;
  altTxtOnImages: boolean;
  localSchema: boolean;
  internalLinks: boolean;
  robotsTxt: boolean;
  ctaAboveFold: boolean;
  stickyMobileCta: boolean;
  faqs: boolean;
  responseTimePromise: boolean;
  breadcrumbs: boolean;
  custom404: boolean;
  thankYouPage: boolean;
  realReviews: boolean;
  caseStudies: boolean;
  teamPhoto: boolean;
  mapsDirections: boolean;
  privacyPolicy: boolean;
  googleAnalytics: boolean;
}

const URL_CACHE_MS = 30_000;
const DOMAIN_RATE_LIMIT_MS = 10_000;
const scanCache = new MemoryCache<ScanResult>(URL_CACHE_MS);
const domainTimestamps = new Map<string, number>();

function errorResult(error: string) {
  return {
    mobileScore: 0, speedScore: 0, seoScore: 0, contentScore: 0,
    socialScore: 0, pricingScore: 0, paymentScore: 0, aiScore: 0,
    trustScore: 0, contactScore: 0, preLaunchScore: 0,
    rawData: { error, url: "" },
  } satisfies ScanResult;
}

// --- Pre-Launch Checklist (20 items) ---

function checkUniquePageTitles(html: string): boolean {
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (!titleMatch) return false;
  const title = titleMatch[1].trim();
  return title.length > 5 && !/^(untitled|home|page|index)/i.test(title);
}

function checkMetaDescriptions(html: string): boolean {
  const match = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
  return !!match && match[1].trim().length > 20;
}

function checkSocialShareImg(html: string): boolean {
  return /<meta[^>]*property=["']og:image["']/i.test(html) ||
    /<meta[^>]*name=["']twitter:image["']/i.test(html);
}

function checkAltTxtOnImages(html: string): boolean {
  const imgs = html.match(/<img[^>]*>/gi) || [];
  if (imgs.length === 0) return true; // no images = pass
  const withAlt = imgs.filter((img) => /alt=["'][^"']+["']/i.test(img));
  return withAlt.length / imgs.length >= 0.8;
}

function checkLocalSchema(html: string): boolean {
  return /"@type"\s*:\s*"(LocalBusiness|Organization|Restaurant|Store|MedicalBusiness)"/i.test(html) ||
    /itemtype=["'][^"']*LocalBusiness/i.test(html);
}

function checkInternalLinks(html: string, baseUrl: string): boolean {
  try {
    const host = new URL(baseUrl).hostname;
    const links = html.match(/href=["'](https?:\/\/[^"']+)["']/gi) || [];
    const internal = links.filter((l) => l.includes(host));
    return internal.length >= 3;
  } catch {
    return false;
  }
}

function checkRobotsTxt(html: string): boolean {
  return /robots\.txt/i.test(html);
}

function checkCtaAboveFold(html: string): boolean {
  const body = html.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<style[\s\S]*?<\/style>/gi, "");
  const first1500 = body.substring(0, 1500);
  return /(cta|call.to.action|get.started|sign.up|contact.us|book.now|order.now|ابدأ|تواصل|احجز|سجل)/i.test(first1500);
}

function checkStickyMobileCta(html: string): boolean {
  return /position:\s*fixed[^}]*(?:bottom|z-index)/i.test(html) ||
    /sticky|bottom-bar|fixed-bottom/i.test(html);
}

function checkFaqs(html: string): boolean {
  const faqMatches = html.match(/<details|<summary|faq|accordion|الأسئلة|سؤال/gi) || [];
  return faqMatches.length >= 3;
}

function checkResponseTimePromise(html: string): boolean {
  return /(response.time|reply.within|نردود|سرعة الرد|within.*hours|24.*hour|48.*hour)/i.test(html);
}

function checkBreadcrumbs(html: string): boolean {
  return /breadcrumb/i.test(html) ||
    /"@type"\s*:\s*"BreadcrumbList"/i.test(html) ||
    /itemtype=["'][^"']*BreadcrumbList/i.test(html);
}

function checkCustom404(html: string): boolean {
  // Can't detect from main page — check if the site mentions it or has error page patterns
  return /(404|page.not.found|custom.error)/i.test(html);
}

function checkThankYouPage(html: string): boolean {
  return /(thank.you|شكراً|شكرًا|success.message|submission.received)/i.test(html);
}

function checkRealReviews(html: string): boolean {
  return /"@type"\s*:\s*"Review"/i.test(html) ||
    /itemtype=["'][^"']*Review/i.test(html) ||
    /review.*rating|star.*review/i.test(html);
}

function checkCaseStudies(html: string): boolean {
  return /(case.study|دراسة|project.*portfolio|our.work|أعمالنا|معرض)/i.test(html);
}

function checkTeamPhoto(html: string): boolean {
  return /(team|about.*us|meet.*the|فريق|من.*نحن|staff|crew)/i.test(html) &&
    /<img/i.test(html);
}

function checkMapsDirections(html: string): boolean {
  return /(maps\.google|goo\.gl\/maps|openstreetmap|iframe.*maps|location.*map|خريطة)/i.test(html);
}

function checkPrivacyPolicy(html: string): boolean {
  return /(privacy.policy|سياسة.*الخصوصية|data.protection|gdpr)/i.test(html);
}

function checkGoogleAnalytics(html: string): boolean {
  return /(google-analytics|gtag|googletagmanager|GA_MEASUREMENT_ID|analytics\.js|gtag\.js)/i.test(html);
}

function runPreLaunchChecks(html: string, url: string): { score: number; checks: PreLaunchChecks } {
  const checks: PreLaunchChecks = {
    uniquePageTitles: checkUniquePageTitles(html),
    metaDescriptions: checkMetaDescriptions(html),
    socialShareImg: checkSocialShareImg(html),
    altTxtOnImages: checkAltTxtOnImages(html),
    localSchema: checkLocalSchema(html),
    internalLinks: checkInternalLinks(html, url),
    robotsTxt: checkRobotsTxt(html),
    ctaAboveFold: checkCtaAboveFold(html),
    stickyMobileCta: checkStickyMobileCta(html),
    faqs: checkFaqs(html),
    responseTimePromise: checkResponseTimePromise(html),
    breadcrumbs: checkBreadcrumbs(html),
    custom404: checkCustom404(html),
    thankYouPage: checkThankYouPage(html),
    realReviews: checkRealReviews(html),
    caseStudies: checkCaseStudies(html),
    teamPhoto: checkTeamPhoto(html),
    mapsDirections: checkMapsDirections(html),
    privacyPolicy: checkPrivacyPolicy(html),
    googleAnalytics: checkGoogleAnalytics(html),
  };
  const passed = Object.values(checks).filter(Boolean).length;
  return { score: Math.round((passed / 20) * 10), checks };
}

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
      trustScore: 0, contactScore: 0, preLaunchScore: 0,
      rawData: { error: `Rate limited. Wait ${Math.ceil((DOMAIN_RATE_LIMIT_MS - (Date.now() - lastDomainScan)) / 1000)}s.`, url },
    };
  }

  domainTimestamps.set(domain, Date.now());

  let urlObj: URL;
  try {
    urlObj = validateUrl(fullUrl);
  } catch {
    return errorResult("Invalid or private URL");
  }

  const hostname = urlObj.hostname;

  // Single resolution — the fetch below is pinned to these addresses and cannot re-resolve.
  let resolved: { address: string; family: number }[];
  try {
    resolved = await dnsLookup(hostname, { all: true, verbatim: true });
  } catch {
    return errorResult("Could not resolve hostname");
  }
  if (containsPrivateIP(resolved)) {
    return errorResult("Target resolves to private IP");
  }

  const pinnedLookup: LookupFunction = (_host, _opts, cb) => {
    const addr = resolved[0];
    cb(null, addr.address, addr.family);
  };
  const dispatcher = new Agent({ connect: { lookup: pinnedLookup } });

  let html = "";
  const headers: Record<string, string> = {};
  let fetchSuccess = false;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const res = await undiciFetch(fullUrl, {
      signal: controller.signal,
      headers: { "User-Agent": "WujoodAudit/1.0" },
      redirect: "error",
      dispatcher,
    });

    const reader = res.body?.getReader();
    if (reader) {
      const decoder = new TextDecoder();
      let bytes = 0;
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        bytes += value.byteLength;
        html += decoder.decode(value, { stream: true });
        if (bytes > MAX_RESPONSE_BYTES) {
          controller.abort();
          reader.cancel().catch(() => {});
          break;
        }
      }
      html += decoder.decode();
    }

    clearTimeout(timeout);
    res.headers.forEach((v, k) => { headers[k.toLowerCase()] = v; });
    fetchSuccess = !!html;
  } catch {
    html = "";
  }

  if (!fetchSuccess || !html) {
    return {
      mobileScore: 0, speedScore: 0, seoScore: 0, contentScore: 0,
      socialScore: 0, pricingScore: 0, paymentScore: 0, aiScore: 0,
      trustScore: 0, contactScore: 0, preLaunchScore: 0,
      rawData: { error: "Could not fetch URL", url },
    };
  }

  const lower = html.toLowerCase();
  const preLaunch = runPreLaunchChecks(html, fullUrl);
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
    preLaunchScore: preLaunch.score,
    rawData: { url, fetchedAt: new Date().toISOString(), headers, jsRendered: detectJsRendered(html), preLaunchChecks: preLaunch.checks },
  };

  scanCache.set(cacheKey, result);
  return result;
}
