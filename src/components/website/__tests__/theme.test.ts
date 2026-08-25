import { describe, it, expect } from "vitest";
import { resolveSiteColors, safeHex, pickTextColor, extractWhatsappPhone, DEFAULT_SITE_COLORS } from "../theme";

describe("safeHex", () => {
  it("accepts 3- and 6-digit hex", () => {
    expect(safeHex("#fff", "#000")).toBe("#fff");
    expect(safeHex("#AbCdEf", "#000")).toBe("#AbCdEf");
  });
  it("rejects non-hex and falls back", () => {
    expect(safeHex("red", "#123abc")).toBe("#123abc");
    expect(safeHex("#12345", "#000")).toBe("#000");
    expect(safeHex("javascript:alert(1)", "#000")).toBe("#000");
    expect(safeHex(null, "#000")).toBe("#000");
    expect(safeHex("<script>", "#000")).toBe("#000");
  });
});

describe("resolveSiteColors", () => {
  it("returns defaults for missing/garbage input", () => {
    expect(resolveSiteColors(undefined)).toEqual(DEFAULT_SITE_COLORS);
    expect(resolveSiteColors("nonsense")).toEqual(DEFAULT_SITE_COLORS);
    expect(resolveSiteColors([1, 2])).toEqual(DEFAULT_SITE_COLORS);
    expect(resolveSiteColors({ primary: 5 })).toEqual(DEFAULT_SITE_COLORS);
  });
  it("uses valid provided values, defaults for invalid keys", () => {
    const c = resolveSiteColors({ primary: "#ff0000", accent: "nope" });
    expect(c.primary).toBe("#ff0000");
    expect(c.accent).toBe(DEFAULT_SITE_COLORS.accent);
  });
});

describe("pickTextColor", () => {
  it("picks dark text on light backgrounds", () => {
    expect(pickTextColor("#ffffff")).toBe("#111827");
    expect(pickTextColor("#f3f4f6")).toBe("#111827");
  });
  it("picks light text on dark/saturated backgrounds", () => {
    expect(pickTextColor("#111827")).toBe("#ffffff");
    expect(pickTextColor("#2563eb")).toBe("#ffffff");
  });
});

describe("extractWhatsappPhone", () => {
  it("finds phone in whatsapp-cta blocks across pages", () => {
    const pages = [
      { content: [{ type: "paragraph", text: "hi" }] },
      { content: [{ type: "whatsapp-cta", phone: "+20 100 234 5678" }] },
    ];
    expect(extractWhatsappPhone({}, pages)).toBe("201002345678");
  });
  it("falls back to colors.whatsapp / colors.phone", () => {
    expect(extractWhatsappPhone({ whatsapp: "+201002345678" }, [])).toBe("201002345678");
    expect(extractWhatsappPhone({ phone: "01002345678" }, [])).toBe("01002345678");
  });
  it("rejects too-short digit strings and returns null when absent", () => {
    expect(extractWhatsappPhone({ phone: "12345" }, [])).toBeNull();
    expect(extractWhatsappPhone({}, [])).toBeNull();
  });
});
