import { prisma } from "@/lib/prisma"
import { Header } from "@/components/ui/header"
import { Footer } from "@/components/ui/footer"
import { Card } from "@/components/ui/card"
import Link from "next/link"

export default async function DirectoryPage() {
  const websites = await prisma.website.findMany({ where: { published: true }, orderBy: { updatedAt: "desc" }, take: 50 })

  return (
    <>
      <Header />
      <main className="px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">دليل المواقع</h1>
          <p className="text-gray-600 mb-8">اكتشف مواقع الأعمال المصرية المنشأة على Wujood</p>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {websites.map((site) => (
              <Link key={site.id} href={`/directory/${site.subdomain}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <h3 className="font-semibold text-gray-900">{site.businessName || site.subdomain}</h3>
                  <p className="text-sm text-gray-500 mt-1">{site.subdomain}.wujood.app</p>
                  {site.description && <p className="text-sm text-gray-600 mt-2 line-clamp-2">{site.description}</p>}
                </Card>
              </Link>
            ))}
          </div>
          {websites.length === 0 && <p className="text-center text-gray-500 py-12">لا توجد مواقع منشورة بعد</p>}
        </div>
      </main>
      <Footer />
    </>
  )
}
