import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const site = await prisma.website.findFirst({ where: { domain: slug, isPublished: true } });
  if (!site) return { title: "Site Not Found" };
  return {
    title: site.title || slug,
    description: site.description || undefined,
  };
}

function ContentBlock({ block }: { block: Record<string, unknown> }) {
  switch (block.type) {
    case "heading":
      return <h2 className="text-2xl font-bold mb-4 text-gray-900">{String(block.text ?? "")}</h2>;
    case "subheading":
      return <h3 className="text-xl font-semibold mb-3 text-gray-800">{String(block.text ?? "")}</h3>;
    case "paragraph":
      return <p className="mb-4 leading-relaxed text-gray-700">{String(block.text ?? "")}</p>;
    default:
      return null;
  }
}

export default async function WebsitePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const site = await prisma.website.findFirst({
    where: { domain: slug, isPublished: true },
    include: { pages: { orderBy: { order: "asc" } } },
  });

  if (!site) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Site Not Found</h1>
          <p className="text-gray-600">The site you are looking for does not exist or is not published.</p>
        </div>
      </div>
    );
  }

  const colors = (site.colors ?? {}) as Record<string, string>;
  const primaryColor = colors.primary || "#1f2937";
  const bgColor = colors.secondary || "#f9fafb";

  return (
    <div className="min-h-screen" style={{ backgroundColor: bgColor }}>
      <header className="py-16 px-6 text-center" style={{ backgroundColor: primaryColor }}>
        {site.logoUrl && (
          <img src={site.logoUrl} alt="" className="h-16 mx-auto mb-4" />
        )}
        <h1 className="text-4xl font-bold text-white mb-2">{site.title || slug}</h1>
        {site.description && (
          <p className="text-lg text-white/80 max-w-2xl mx-auto">{site.description}</p>
        )}
      </header>
      <main className="max-w-4xl mx-auto px-6 py-12">
        {site.pages.length === 0 ? (
          <p className="text-center text-gray-500 py-16">This site has no pages yet.</p>
        ) : (
          site.pages.map((page) => (
            <section key={page.id} className="mb-12">
              {page.title && (
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{page.title}</h2>
              )}
              <div>
                {Array.isArray(page.content) ? (
                  (page.content as Array<Record<string, unknown>>).map((block, i) => (
                    <ContentBlock key={i} block={block} />
                  ))
                ) : (
                  <p className="text-gray-500">No content yet.</p>
                )}
              </div>
            </section>
          ))
        )}
      </main>
      <footer className="text-center py-8 text-sm text-gray-500">
        Powered by Wujood
      </footer>
    </div>
  );
}
