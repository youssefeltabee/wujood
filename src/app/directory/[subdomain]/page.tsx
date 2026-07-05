import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"

export default async function WebsitePage({ params }: { params: Promise<{ subdomain: string }> }) {
  const { subdomain } = await params
  const website = await prisma.website.findUnique({ where: { subdomain }, include: { reviews: { orderBy: { createdAt: "desc" }, take: 10 }, catalogItems: { take: 20 } } })
  if (!website || !website.published) notFound()

  const section = (type: string) => website.structure?.sections?.find((s: any) => s.type === type)
  const content = (type: string) => section(type)?.content || {}

  return (
    <main className="min-h-screen bg-white">
      {content("hero")?.title && (
        <section className="ghost-gradient text-white px-4 py-20 text-center">
          <h1 className="text-4xl font-bold">{content("hero").title}</h1>
          {content("hero").subtitle && <p className="text-indigo-200 mt-4 text-lg">{content("hero").subtitle}</p>}
        </section>
      )}
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-16">
        {website.structure?.sections?.filter((s: any) => s.type !== "hero").map((s: any, i: number) => (
          <section key={i}>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{s.content?.title || s.type}</h2>
            {s.content?.subtitle && <p className="text-gray-600">{s.content.subtitle}</p>}
          </section>
        ))}
        {website.catalogItems.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">المنتجات</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">{website.catalogItems.map((item) => (
              <div key={item.id} className="border border-gray-200 rounded-xl p-4">
                {item.imageUrl && <img src={item.imageUrl} alt={item.name} className="w-full h-32 object-cover rounded-lg mb-2" />}
                <h3 className="font-semibold text-gray-900">{item.name}</h3>
                <p className="text-indigo-600 font-bold mt-1">{item.price} ج.م</p>
              </div>
            ))}</div>
          </section>
        )}
      </div>
    </main>
  )
}
