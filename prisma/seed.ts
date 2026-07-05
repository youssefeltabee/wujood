import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding templates...")

  const templates = [
    {
      name: "",
      description: "",
      category: "retail",
      structure: {
        sections: [
          { type: "hero", content: { title: "", subtitle: "" } },
          { type: "products", content: { title: "" } },
          { type: "about", content: { title: "" } },
          { type: "contact", content: { title: "" } },
        ],
      },
    },
  ]

  for (const template of templates) {
    await prisma.template.create({ data: template })
  }

  console.log(`Seeded ${templates.length} templates`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
