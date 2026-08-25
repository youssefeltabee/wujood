import type { CSSProperties } from "react";

export interface SiteColors {
  primary: string;
  accent: string;
  bg: string;
  text: string;
}

export const DEFAULT_SITE_COLORS: SiteColors = {
  primary: "#2563eb",
  accent: "#0ea5e9",
  bg: "#ffffff",
  text: "#111827",
};

const HEX_RE = /^#(?:[\da-fA-F]{3}|[\da-fA-F]{6})$/;

export function safeHex(value: unknown, fallback: string): string {
  return typeof value === "string" && HEX_RE.test(value) ? value : fallback;
}

export function resolveSiteColors(raw: unknown): SiteColors {
  const c = (raw && typeof raw === "object" && !Array.isArray(raw) ? raw : {}) as Record<
    string,
    unknown
  >;
  return {
    primary: safeHex(c.primary, DEFAULT_SITE_COLORS.primary),
    accent: safeHex(c.accent, DEFAULT_SITE_COLORS.accent),
    bg: safeHex(c.bg, DEFAULT_SITE_COLORS.bg),
    text: safeHex(c.text, DEFAULT_SITE_COLORS.text),
  };
}

export function siteCssVars(colors: SiteColors): CSSProperties {
  return {
    "--site-primary": colors.primary,
    "--site-accent": colors.accent,
    "--site-bg": colors.bg,
    "--site-text": colors.text,
  } as CSSProperties;
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.slice(1);
  const full =
    h.length === 3
      ? h[0] + h[0] + h[1] + h[1] + h[2] + h[2]
      : h;
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ];
}

function channelLuminance(channel: number): number {
  const s = channel / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex);
  return (
    0.2126 * channelLuminance(r) +
    0.7152 * channelLuminance(g) +
    0.0722 * channelLuminance(b)
  );
}

const DARK_TEXT = "#111827";
const LIGHT_TEXT = "#ffffff";

function contrastRatio(a: number, b: number): number {
  const [hi, lo] = a > b ? [a, b] : [b, a];
  return (hi + 0.05) / (lo + 0.05);
}

export function pickTextColor(bgHex: string): string {
  const l = relativeLuminance(safeHex(bgHex, DEFAULT_SITE_COLORS.primary));
  return contrastRatio(l, relativeLuminance(DARK_TEXT)) >=
    contrastRatio(l, relativeLuminance(LIGHT_TEXT))
    ? DARK_TEXT
    : LIGHT_TEXT;
}

const MIN_PHONE_DIGITS = 7;

function digitsOf(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const d = value.replace(/\D/g, "");
  return d.length >= MIN_PHONE_DIGITS ? d : null;
}

function phoneFromContent(content: unknown): string | null {
  if (!Array.isArray(content)) return null;
  for (const item of content) {
    if (!item || typeof item !== "object" || Array.isArray(item)) continue;
    const b = item as Record<string, unknown>;
    if (b.type !== "whatsapp-cta") continue;
    const d = digitsOf(b.phone);
    if (d) return d;
  }
  return null;
}

export function extractWhatsappPhone(
  colorsRaw: unknown,
  pages: ReadonlyArray<{ content: unknown }>,
): string | null {
  for (const page of pages) {
    const fromPage = phoneFromContent(page?.content);
    if (fromPage) return fromPage;
  }
  const c = (colorsRaw && typeof colorsRaw === "object" && !Array.isArray(colorsRaw)
    ? colorsRaw
    : {}) as Record<string, unknown>;
  for (const key of ["whatsapp", "phone"]) {
    const d = digitsOf(c[key]);
    if (d) return d;
  }
  return null;
}
