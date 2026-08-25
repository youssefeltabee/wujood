import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();

async function main() {
  const admin = await p.user.findFirst({ where: { role: "ADMIN" } });
  if (!admin) throw new Error("no admin");

  await p.website.deleteMany({ where: { domain: "demo-cafe" } });

  const site = await p.website.create({
    data: {
      userId: admin.id,
      domain: "demo-cafe",
      title: "El Shark Café",
      description: "Traditional Egyptian coffee house in the heart of Cairo. Beans roasted daily since 1987.",
      colors: { primary: "#8B4513", accent: "#D4A853", bg: "#FDF8F2", text: "#2D1B0E" },
      isPublished: true,
      pages: {
        create: [
          {
            slug: "home",
            title: null,
            order: 0,
            content: [
              { type: "paragraph", text: "أهلاً وسهلاً — welcome to Cairo's warmest corner. We serve slow-roasted Arabic coffee, fresh mint tea, and pastries baked every morning." },
              { type: "list", items: ["Turkish & Arabic coffee, roasted in-house", "Fresh baladi bread daily", "Family seating hall with WiFi"] },
            ],
          },
          {
            slug: "menu",
            title: "Our Menu",
            order: 1,
            content: [
              { type: "heading", text: "Coffee & Drinks" },
              { type: "paragraph", text: "Every cup is prepared on hot sand the traditional way. Ask for ours with less sugar — we call it saada." },
              { type: "list", items: ["Arabic coffee (qahwa) — 25 EGP", "Mint tea (shai bi na'na) — 15 EGP", "Hibiscus (karkadeh), hot or iced — 18 EGP"] },
              { type: "cta-button", label: "See Full Menu", href: "https://example.com/menu" },
            ],
          },
          {
            slug: "visit",
            title: "Visit Us",
            order: 2,
            content: [
              { type: "subheading", text: "Open daily 7 AM – 1 AM" },
              { type: "paragraph", text: "12 El Moez Street, El Gamaleya, Cairo. Two minutes from Khan el-Khalili." },
              { type: "whatsapp-cta", phone: "+201002345678", label: "Reserve a Table" },
            ],
          },
        ],
      },
    },
    include: { pages: true, template: true },
  });
  console.log("demo site:", site.domain, "pages:", site.pages.length);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => p.$disconnect());
