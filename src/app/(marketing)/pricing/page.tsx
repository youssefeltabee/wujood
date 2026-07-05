import { Header } from "@/components/ui/header"
import { Footer } from "@/components/ui/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PLANS } from "@/lib/stripe"

const PLANS_DATA = [
  { key: "kashif", name: "كاشف", nameEn: "Kashif", price: "1,250", desc: "للشركات التي تبدأ رحلتها الرقمية", features: ["موقع إلكتروني متكامل", "تدقيق الشبح الرقمي", "ردود تلقائية واتساب", "مجال فرعي مجاني", "دعم عبر البريد"], popular: false },
  { key: "sane", name: "صانع", nameEn: "Sane", price: "2,500", desc: "للشركات التي تتوسع رقمياً", features: ["كل مزايا كاشف", "إدارة التواصل الاجتماعي", "كتالوج منتجات", "نظام التقييمات", "تحليلات أساسية", "دعم عبر الواتساب"], popular: true },
  { key: "raed", name: "رائد", nameEn: "Raed", price: "4,500", desc: "للشركات التي تقود السوق", features: ["كل مزايا صانع", "مساعد ذكي (AI Chatbot)", "متجر إلكتروني بسيط", "تحليلات متقدمة", "مجال مخصص", "دعم أولوية"], popular: false },
]

export default function PricingPage() {
  return (
    <>
      <Header />
      <main className="px-4 py-16">
        <div className="mx-auto max-w-7xl text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">باقات مرنة تناسب الجميع</h1>
          <p className="text-gray-600 mb-12 max-w-xl mx-auto">اختر الباقة التي تناسب حجم نشاطك التجاري — كل الباقات بالجنيه المصري شهرياً</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PLANS_DATA.map((plan) => (
              <div key={plan.key} className={`rounded-2xl border p-8 text-right ${plan.popular ? "border-indigo-500 shadow-lg ring-1 ring-indigo-500" : "border-gray-200 shadow-sm"}`}>
                {plan.popular && <div className="inline-block rounded-full bg-indigo-600 text-white text-xs px-3 py-1 mb-4">الأكثر طلباً</div>}
                <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                <p className="text-gray-500 text-sm mt-1">{plan.desc}</p>
                <p className="mt-6"><span className="text-4xl font-bold text-gray-900">{plan.price}</span> <span className="text-gray-500">ج.م / شهرياً</span></p>
                <ul className="mt-8 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-700"><span className="text-green-500">✓</span> {f}</li>
                  ))}
                </ul>
                <Link href={`/register?plan=${plan.key}`}><Button variant={plan.popular ? "brand" : "outline"} className="w-full mt-8">اختر {plan.name}</Button></Link>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
