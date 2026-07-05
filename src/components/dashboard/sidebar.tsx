"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const ITEMS = [
  { href: "/dashboard", label: "لوحة التحكم", icon: "📊" },
  { href: "/dashboard/website", label: "الموقع الإلكتروني", icon: "🌐" },
  { href: "/dashboard/social", label: "التواصل الاجتماعي", icon: "📱" },
  { href: "/dashboard/messages", label: "الرسائل", icon: "💬" },
  { href: "/dashboard/catalog", label: "كتالوج المنتجات", icon: "📦" },
  { href: "/dashboard/reviews", label: "التقييمات", icon: "⭐" },
  { href: "/dashboard/subscription", label: "الباقة والاشتراك", icon: "💳" },
  { href: "/dashboard/settings", label: "الإعدادات", icon: "⚙️" },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex flex-col w-64 border-l border-gray-200 bg-white min-h-screen">
      <div className="flex items-center gap-2 px-6 h-16 border-b border-gray-100">
        <Link href="/" className="text-xl font-bold gradient-text">Wujood</Link>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {ITEMS.map((item) => (
          <Link key={item.href} href={item.href} className={cn("flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors", pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href)) ? "bg-indigo-50 text-indigo-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900")}>
            <span>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
