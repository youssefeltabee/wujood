import { Blocks } from "./blocks";
import type { SiteColors, SiteBlock } from "./theme-exports";

export type TemplateLayout = "classic" | "bold" | "minimal";

export interface SitePageData {
  id: string;
  title: string | null;
  content: unknown;
}

const CATEGORY_LAYOUT: Record<string, TemplateLayout> = {
  professional: "classic",
  service: "classic",
  restaurant: "bold",
  retail: "bold",
  ecommerce: "bold",
};

export function layoutForCategory(category: string | null | undefined): TemplateLayout {
  return (category && CATEGORY_LAYOUT[category]) || "minimal";
}

function PageBody({ page, colors }: { page: SitePageData; colors: SiteColors }) {
  return (
    <section className="mb-14">
      {page.title ? (
        <h2 dir="auto" className="mb-6 text-3xl font-bold" style={{ color: colors.text }}>
          {page.title}
        </h2>
      ) : null}
      <Blocks content={page.content} colors={colors} />
    </section>
  );
}

export function ClassicSite({
  siteName,
  description,
  logoUrl,
  pages,
  colors,
}: {
  siteName: string;
  description: string | null;
  logoUrl: string | null;
  pages: SitePageData[];
  colors: SiteColors;
}) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <header className="mb-16 text-center">
        {logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logoUrl} alt={siteName} loading="lazy" className="mx-auto mb-6 h-20 object-contain" />
        ) : null}
        <h1 dir="auto" className="mb-4 text-5xl font-bold tracking-tight" style={{ color: colors.text }}>
          {siteName}
        </h1>
        {description ? (
          <p dir="auto" className="mx-auto max-w-xl text-lg opacity-75" style={{ color: colors.text }}>
            {description}
          </p>
        ) : null}
      </header>
      <main>
        {pages.length === 0 ? <ComingSoon colors={colors} /> : pages.map((p) => <PageBody key={p.id} page={p} colors={colors} />)}
      </main>
    </div>
  );
}

export function BoldSite({
  siteName,
  description,
  logoUrl,
  pages,
  colors,
}: {
  siteName: string;
  description: string | null;
  logoUrl: string | null;
  pages: SitePageData[];
  colors: SiteColors;
}) {
  const [first, ...rest] = pages;
  return (
    <div>
      <header
        className="px-8 pb-24 pt-28 text-center"
        style={{
          background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
          color: "#ffffff",
          clipPath: "polygon(0 0, 100% 0, 100% 88%, 0 100%)",
        }}
      >
        {logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logoUrl} alt={siteName} loading="lazy" className="mx-auto mb-6 h-20 object-contain brightness-0 invert" />
        ) : null}
        <h1 dir="auto" className="mx-auto max-w-3xl text-6xl font-black uppercase leading-none tracking-tighter md:text-7xl">
          {siteName}
        </h1>
        {description ? (
          <p dir="auto" className="mx-auto mt-6 max-w-xl text-xl opacity-90">
            {description}
          </p>
        ) : null}
      </header>
      <main className="mx-auto -mt-10 max-w-4xl rounded-3xl bg-white p-8 shadow-xl md:p-12" style={{ color: colors.text }}>
        {pages.length === 0 ? (
          <ComingSoon colors={colors} />
        ) : (
          <>
            {first ? <PageBody page={first} colors={colors} /> : null}
            {rest.map((p) => (
              <div key={p.id} className="border-t pt-14" style={{ borderColor: `${colors.primary}22` }}>
                <PageBody page={p} colors={colors} />
              </div>
            ))}
          </>
        )}
      </main>
    </div>
  );
}

export function MinimalSite({
  siteName,
  description,
  logoUrl,
  navPages,
  pages,
  colors,
}: {
  siteName: string;
  description: string | null;
  logoUrl: string | null;
  navPages: Array<{ slug: string; title: string | null }>;
  pages: SitePageData[];
  colors: SiteColors;
}) {
  return (
    <div className="mx-auto max-w-2xl px-6 py-20">
      <nav className="mb-20 flex items-center justify-between">
        <span className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: colors.text }}>
          {siteName}
        </span>
        {navPages.length > 0 ? (
          <ul className="flex gap-6 text-xs uppercase tracking-widest opacity-70" style={{ color: colors.text }}>
            {navPages.slice(0, 5).map((p) => (
              <li key={p.slug}>{p.title ?? p.slug}</li>
            ))}
          </ul>
        ) : null}
      </nav>
      <header className="mb-20 border-b pb-16" style={{ borderColor: `${colors.text}18` }}>
        {logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logoUrl} alt={siteName} loading="lazy" className="mb-8 h-14 object-contain" />
        ) : null}
        <h1 dir="auto" className="mb-4 font-light" style={{ color: colors.text, fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
          {siteName}
        </h1>
        {description ? (
          <p dir="auto" className="text-base leading-relaxed opacity-60" style={{ color: colors.text }}>
            {description}
          </p>
        ) : null}
      </header>
      <main>
        {pages.length === 0 ? <ComingSoon colors={colors} /> : pages.map((p) => <PageBody key={p.id} page={p} colors={colors} />)}
      </main>
    </div>
  );
}

export function ComingSoon({ colors }: { colors: SiteColors }) {
  return (
    <div className="py-24 text-center">
      <p className="text-lg italic opacity-50" style={{ color: colors.text }}>
        Site coming soon.
      </p>
    </div>
  );
}

export type { SiteBlock };
