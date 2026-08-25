import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { resolveSiteColors, siteCssVars, extractWhatsappPhone } from "@/components/website/theme";
import { ClassicSite, BoldSite, MinimalSite, layoutForCategory } from "@/components/website/templates";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const site = await prisma.website.findFirst({
    where: { domain: slug, isPublished: true, deletedAt: null },
    select: { title: true, description: true },
  });
  if (!site) return { title: "Site Not Found" };
  return {
    title: site.title || slug,
    description: site.description || undefined,
    openGraph: {
      title: site.title || slug,
      description: site.description || undefined,
      type: "website",
    },
  };
}

export default async function WebsitePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const site = await prisma.website.findFirst({
    where: { domain: slug, isPublished: true, deletedAt: null },
    include: {
      pages: { orderBy: { order: "asc" }, select: { id: true, title: true, slug: true, content: true } },
      template: { select: { category: true } },
    },
  });

  if (!site) notFound();

  const colors = resolveSiteColors(site.colors);
  const siteName = site.title || slug;
  const layout = layoutForCategory(site.template?.category);
  const pages = site.pages.map((p) => ({ id: p.id, title: p.title, content: p.content }));
  const waPhone = extractWhatsappPhone(site.colors, site.pages.map((p) => ({ content: p.content })));

  const shared = { siteName, description: site.description, logoUrl: site.logoUrl, colors };

  return (
    <div className="site-shell min-h-screen" style={{ ...siteCssVars(colors), backgroundColor: colors.bg }}>
      {layout === "classic" && <ClassicSite {...shared} pages={pages} />}
      {layout === "bold" && <BoldSite {...shared} pages={pages} />}
      {layout === "minimal" && (
        <MinimalSite
          {...shared}
          navPages={site.pages.map((p) => ({ slug: p.slug, title: p.title }))}
          pages={pages}
        />
      )}
      <footer className="border-t py-8 text-center text-xs opacity-50" style={{ borderColor: `${colors.text}14`, color: colors.text }}>
        © {new Date().getFullYear()} {siteName}
        {waPhone ? (
          <>
            {" · "}
            <a href={`https://wa.me/${waPhone}`} target="_blank" rel="noopener noreferrer" className="underline">
              WhatsApp
            </a>
          </>
        ) : null}
        {" · Powered by Wujood"}
      </footer>
    </div>
  );
}
