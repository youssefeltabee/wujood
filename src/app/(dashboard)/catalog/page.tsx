import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function CatalogPage() {
  const user = await getSession()
  if (!user) redirect("/login")
  const items = await prisma.catalogItem.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" } })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">كتالوج المنتجات</h1>
        <Link href="/dashboard/catalog/create"><Button variant="brand">إضافة منتج</Button></Link>
      </div>
      {items.length === 0 ? (
        <Card><p className="text-gray-500 text-center py-8">لم يتم إضافة أي منتجات بعد</p></Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {items.map((item) => (
            <Card key={item.id}>
              {item.imageUrl && <img src={item.imageUrl} alt={item.name} className="w-full h-40 object-cover rounded-lg mb-3" />}
              <h3 className="font-medium text-gray-900">{item.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{item.description?.slice(0, 60)}...</p>
              <p className="text-indigo-600 font-bold mt-2">{item.price} ج.م</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
