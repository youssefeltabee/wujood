import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding templates...")

  const templates = [
    {
      name: "متجر إلكتروني",
      description: "قالب عصري للمتاجر الإلكترونية مع عرض منتجات وسلة تسوق",
      category: "retail",
      structure: { sections: [{ type: "hero", content: { title: "متجرنا", subtitle: "أفضل المنتجات بأفضل الأسعار" } }, { type: "products", content: { title: "منتجاتنا" } }, { type: "about", content: { title: "من نحن" } }, { type: "contact", content: { title: "اتصل بنا" } }] },
    },
    {
      name: "شركة خدمات",
      description: "قالب احترافي لشركات الخدمات والاستشارات",
      category: "service",
      structure: { sections: [{ type: "hero", content: { title: "خدماتنا", subtitle: "حلول احترافية لنشاطك التجاري" } }, { type: "services", content: { title: "ماذا نقدم" } }, { type: "about", content: { title: "عن الشركة" } }, { type: "testimonials", content: { title: "ماذا يقول عملاؤنا" } }, { type: "contact", content: { title: "تواصل معنا" } }] },
    },
    {
      name: "مهني مستقل",
      description: "قالب بسيط للمهنيين المستقلين لعرض أعمالهم وخبراتهم",
      category: "professional",
      structure: { sections: [{ type: "hero", content: { title: "أهلاً، أنا", subtitle: "خبرة في تقديم أفضل الحلول" } }, { type: "portfolio", content: { title: "أعمالي" } }, { type: "experience", content: { title: "خبراتي" } }, { type: "contact", content: { title: "تواصل معي" } }] },
    },
    {
      name: "مطعم وكافيه",
      description: "قالب جذاب للمطاعم والكافيهات مع عرض القائمة",
      category: "restaurant",
      structure: { sections: [{ type: "hero", content: { title: "مطعمنا", subtitle: "أشهى الأطباق في أجواء مميزة" } }, { type: "menu", content: { title: "قائمة الطعام" } }, { type: "gallery", content: { title: "معرض الصور" } }, { type: "location", content: { title: "موقعنا" } }, { type: "contact", content: { title: "احجز الآن" } }] },
    },
    {
      name: "مركز صحي",
      description: "قالب للمراكز الصحية والعيادات الطبية",
      category: "healthcare",
      structure: { sections: [{ type: "hero", content: { title: "مركزنا الطبي", subtitle: "صحتك تهمنا" } }, { type: "services", content: { title: "خدماتنا الطبية" } }, { type: "team", content: { title: "فريقنا الطبي" } }, { type: "contact", content: { title: "احجز موعداً" } }] },
    },
  ]

  for (const template of templates) {
    await prisma.template.create({ data: template })
  }

  console.log(`Seeded ${templates.length} templates`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
