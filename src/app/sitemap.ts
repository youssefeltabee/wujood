import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://wujood-opal.vercel.app";
  const now = new Date();
  const pages = ["", "/features", "/pricing", "/testimonials", "/about", "/contact", "/login", "/register"];
  return pages.map((p) => ({
    url: `${base}${p || "/"}`,
    lastModified: now,
    changeFrequency: p === "" ? "weekly" : "monthly",
    priority: p === "" ? 1 : p === "/pricing" ? 0.9 : 0.7,
  }));
}
