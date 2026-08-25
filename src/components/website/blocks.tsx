import { pickTextColor, type SiteColors } from "./theme";

// ponytail: tenant URLs untrusted/varied — plain img avoids next/image remotePatterns config per-domain
export type SiteBlock = Record<string, unknown>;

const str = (v: unknown): string => (typeof v === "string" ? v : "");

function safeHttpUrl(v: unknown): string | null {
  const s = str(v);
  try {
    const u = new URL(s);
    return u.protocol === "http:" || u.protocol === "https:" ? s : null;
  } catch {
    return null;
  }
}

export function BlockRenderer({ block, colors }: { block: SiteBlock; colors: SiteColors }) {
  switch (block.type) {
    case "heading":
      return (
        <h2 dir="auto" className="mb-4 text-2xl font-bold md:text-3xl" style={{ color: colors.text }}>
          {str(block.text)}
        </h2>
      );
    case "subheading":
      return (
        <h3 dir="auto" className="mb-3 text-xl font-semibold" style={{ color: colors.text }}>
          {str(block.text)}
        </h3>
      );
    case "paragraph":
      return (
        <p dir="auto" className="mb-4 leading-relaxed opacity-90" style={{ color: colors.text }}>
          {str(block.text)}
        </p>
      );
    case "image": {
      const src = safeHttpUrl(block.src);
      if (!src) return null;
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={str(block.alt)}
          loading="lazy"
          className="mb-6 w-full rounded-xl object-cover shadow-sm"
          style={{ maxHeight: "480px" }}
        />
      );
    }
    case "list": {
      const items = Array.isArray(block.items) ? block.items.map(str).filter(Boolean) : [];
      if (items.length === 0) return null;
      return (
        <ul dir="auto" className="mb-6 space-y-2 ps-6" style={{ color: colors.text }}>
          {items.map((item, i) => (
            <li key={i} className="list-disc opacity-90">
              {item}
            </li>
          ))}
        </ul>
      );
    }
    case "cta-button": {
      const label = str(block.label) || "Learn more";
      const href = safeHttpUrl(block.href) ?? "#";
      return (
        <div className="mb-6">
          <a
            href={href}
            className="inline-block rounded-lg px-6 py-3 font-semibold transition-transform hover:-translate-y-0.5"
            style={{ backgroundColor: colors.primary, color: pickTextColor(colors.primary) }}
          >
            {label}
          </a>
        </div>
      );
    }
    case "whatsapp-cta": {
      const phone = str(block.phone).replace(/\D/g, "");
      if (!phone) return null;
      const label = str(block.label) || "Chat with us";
      const msg = encodeURIComponent(str(block.message) || "");
      return (
        <div className="mb-6">
          <a
            href={`https://wa.me/${phone}${msg ? `?text=${msg}` : ""}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-semibold text-white transition-transform hover:-translate-y-0.5"
            style={{ backgroundColor: "#25D366" }}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden>
              <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.87 9.87 0 0 0 4.79 1.22h.01c5.46 0 9.9-4.45 9.9-9.91A9.86 9.86 0 0 0 12.04 2Zm5.8 14.03c-.25.7-1.45 1.33-2 1.38-.55.05-1.05.15-3-.75-2.35-1.07-3.83-3.5-3.95-3.66-.12-.16-.93-1.28-.93-2.44 0-1.16.6-1.73.82-1.97.22-.24.47-.3.63-.3h.45c.15 0 .34-.03.53.4.2.48.67 1.65.73 1.77.06.12.1.26.02.42-.08.16-.12.26-.24.4l-.36.42c-.12.12-.24.25-.11.49.13.24.58 1 .25 1.62-.35.66-.72 1.1-1.27 1.68-.23.24-.1.44.09.73.19.29.83 1.34 1.78 2.17 1.22 1.07 2.24 1.4 2.56 1.56.32.16.5.13.69-.08.19-.21.79-.92 1-1.24.21-.31.42-.26.71-.15.29.1 1.84.87 2.15 1.03.32.16.53.24.61.37.08.14.08.78-.17 1.53Z" />
            </svg>
            {label}
          </a>
        </div>
      );
    }
    default:
      return null;
  }
}

export function Blocks({ content, colors }: { content: unknown; colors: SiteColors }) {
  if (!Array.isArray(content)) return null;
  return (
    <>
      {(content as SiteBlock[]).map((block, i) => (
        <BlockRenderer key={i} block={block} colors={colors} />
      ))}
    </>
  );
}
