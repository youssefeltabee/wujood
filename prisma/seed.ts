import { PrismaClient } from "@prisma/client";
import { randomBytes } from "crypto";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // ponytail: single-admin bootstrap — SEED_ADMIN_EMAIL/PASSWORD override, else random password printed once
  const email = process.env.SEED_ADMIN_EMAIL ?? "youssefeltabee@gmail.com";
  const existingAdmin = await prisma.user.findFirst({ where: { email, deletedAt: null } });
  if (!existingAdmin) {
    const password = process.env.SEED_ADMIN_PASSWORD ?? randomBytes(12).toString("base64url");
    await prisma.user.create({
      data: {
        email,
        name: "Youssef El Tabee",
        passwordHash: await bcrypt.hash(password, 12),
        role: "ADMIN",
      },
    });
    if (!process.env.SEED_ADMIN_PASSWORD) {
      console.log(`\n=== ADMIN ACCOUNT ===\nemail: ${email}\npassword: ${password}\n(change it after first login)\n`);
    }
  } else {
    await prisma.user.update({ where: { id: existingAdmin.id }, data: { role: "ADMIN" } });
    console.log(`Admin ${email} already exists`);
  }

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
