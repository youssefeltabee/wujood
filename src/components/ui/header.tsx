"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "./button"

const NAV = [
  { href: "/", label: "الرئيسية" },
  { href: "/audit", label: "التدقيق المجاني" },
  { href: "/pricing", label: "الباقات" },
  { href: "/directory", label: "دليل المواقع" },
]

export function Header() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold gradient-text">Wujood</span>
          <span className="text-xs text-gray-400">| وجود</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className={cn("text-sm font-medium transition-colors", pathname === item.href ? "text-indigo-600" : "text-gray-600 hover:text-gray-900")}>{item.label}</Link>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login"><Button variant="ghost" size="sm">تسجيل الدخول</Button></Link>
          <Link href="/register"><Button variant="brand" size="sm">ابدأ مجاناً</Button></Link>
        </div>
        <button onClick={() => setOpen(!open)} className="md:hidden p-2 text-gray-600">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} /></svg>
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className={cn("block text-sm font-medium transition-colors", pathname === item.href ? "text-indigo-600" : "text-gray-600")}>{item.label}</Link>
          ))}
          <div className="flex gap-3 pt-2 border-t border-gray-100">
            <Link href="/login" className="flex-1"><Button variant="outline" size="sm" className="w-full">تسجيل الدخول</Button></Link>
            <Link href="/register" className="flex-1"><Button variant="brand" size="sm" className="w-full">ابدأ مجاناً</Button></Link>
          </div>
        </div>
      )}
    </header>
  )
}
