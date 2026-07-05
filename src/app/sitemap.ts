import type { MetadataRoute } from "next"
import { prisma } from "@/lib/prisma"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://wujood.app"

  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 1 },
    { url: `${baseUrl}/pricing`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/audit`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${baseUrl}/directory`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${baseUrl}/login`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.3 },
    { url: `${baseUrl}/register`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.3 },
  ]

  let directoryPages: MetadataRoute.Sitemap = []
  try {
    const websites = await prisma.website.findMany({
      where: { published: true },
      select: { subdomain: true, updatedAt: true },
    })
    directoryPages = websites.map((site) => ({
      url: `${baseUrl}/directory/${site.subdomain}`,
      lastModified: site.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }))
  } catch {}

  return [...staticPages, ...directoryPages]
}
