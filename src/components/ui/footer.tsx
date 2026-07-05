import Link from "next/link"

const LINKS = {
  services: { title: "الخدمات", items: [{ href: "/audit", label: "التدقيق المجاني" }, { href: "/pricing", label: "الباقات" }, { href: "/directory", label: "دليل المواقع" }] },
  support: { title: "الدعم", items: [{ href: "/about", label: "عن Wujood" }, { href: "/contact", label: "اتصل بنا" }, { href: "/help", label: "المساعدة" }] },
  legal: { title: "قانوني", items: [{ href: "/privacy", label: "سياسة الخصوصية" }, { href: "/terms", label: "شروط الخدمة" }] },
}

export function Footer() {
  return (
    <footer className="ghost-gradient text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <span className="text-2xl font-bold text-white">Wujood</span>
            <p className="mt-2 text-sm text-indigo-200">حول نشاطك التجاري من شبح رقمي إلى كيان رقمي متكامل</p>
          </div>
          {Object.values(LINKS).map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold text-white">{col.title}</h3>
              <ul className="mt-3 space-y-2">
                {col.items.map((item) => (
                  <li key={item.href}><Link href={item.href} className="text-sm text-indigo-200 hover:text-white transition-colors">{item.label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 border-t border-indigo-800 pt-8 text-center text-sm text-indigo-300">
          &copy; {new Date().getFullYear()} Wujood. جميع الحقوق محفوظة.
        </div>
      </div>
    </footer>
  )
}
