import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding templates...");

  const templates = [
    { name: "Professional Service", category: "service", thumbnail: "/templates/service.svg" },
    { name: "Retail Storefront", category: "retail", thumbnail: "/templates/retail.svg" },
    { name: "Modern Portfolio", category: "professional", thumbnail: "/templates/professional.svg" },
    { name: "E-commerce Lite", category: "ecommerce", thumbnail: "/templates/ecommerce.svg" },
    { name: "Restaurant & Cafe", category: "restaurant", thumbnail: "/templates/restaurant.svg" },
  ];

  // Delete existing templates and re-seed
  await prisma.template.deleteMany();
  for (const t of templates) {
    await prisma.template.create({ data: t });
  }

  console.log(`Seeded ${templates.length} templates`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
