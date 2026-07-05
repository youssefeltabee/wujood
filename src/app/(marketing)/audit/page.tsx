import { Header } from "@/components/ui/header"
import { Footer } from "@/components/ui/footer"
import { AuditForm } from "./audit-form"

export default function AuditPage() {
  return (
    <>
      <Header />
      <main className="px-4 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">تدقيق الشبح الرقمي</h1>
          <p className="text-gray-600 mb-8">أدخل رابط موقعك الإلكتروني واحصل على تقرير مفصل عن أدائه الرقمي مع توصيات قابلة للتنفيذ</p>
          <AuditForm />
        </div>
      </main>
      <Footer />
    </>
  )
}
