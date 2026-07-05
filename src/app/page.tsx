import Link from "next/link"
import { Header } from "@/components/ui/header"
import { Footer } from "@/components/ui/footer"
import { Button } from "@/components/ui/button"

const FEATURES = [
  { icon: "🌐", title: "موقع إلكتروني في دقائق", desc: "اختر قالباً واحترفياً وخصصه لعلامتك التجارية دون أي خبرة تقنية" },
  { icon: "📱", title: "إدارة واتساب متكاملة", desc: "ردود تلقائية، رسائل جماعية، وإدارة محادثات العملاء من لوحة تحكم واحدة" },
  { icon: "📊", title: "تدقيق الشبح الرقمي", desc: "تحليل مجاني لوجودك الرقمي واحصل على تقرير مفصل مع توصيات قابلة للتنفيذ" },
  { icon: "📋", title: "كتالوج منتجات", desc: "اعرض منتجاتك وخدماتك بشكل منظم واحترافي مع إمكانية الدفع الإلكتروني" },
  { icon: "⭐", title: "التقييمات والمراجعات", desc: "اجمع تقييمات العملاء واعرضها على موقعك لبناء الثقة" },
  { icon: "🤖", title: "مساعد ذكي", desc: "مساعد AI يجيب على استفسارات عملائك على مدار الساعة" },
]

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <section className="relative overflow-hidden px-4 py-20 sm:py-28 lg:py-36">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_#e0e7ff_0%,_transparent_50%)]" />
          <div className="relative mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-1.5 text-sm text-indigo-700 mb-8">انطلق مع Wujood</div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">حول نشاطك التجاري<br/><span className="gradient-text">من شبح رقمي</span><br/>إلى كيان رقمي</h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">Wujood هي المنصة العربية الأولى لتحويل الشركات الصغيرة والمتوسطة في مصر إلى كيانات رقمية متكاملة. موقع إلكتروني، واتساب، تواصل اجتماعي، وذكاء اصطناعي — كل ذلك في منصة واحدة وبالجنيه المصري.</p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register"><Button variant="brand" size="lg">ابدأ رحلتك الرقمية مجاناً</Button></Link>
              <Link href="/audit"><Button variant="outline" size="lg">احصل على تدقيق مجاني</Button></Link>
            </div>
          </div>
        </section>
        <section className="px-4 py-20 bg-gray-50">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">كل ما تحتاجه في منصة واحدة</h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">صممنا Wujood خصيصاً لأصحاب الشركات الصغيرة والمتوسطة في مصر — أدوات متكاملة باللغة العربية وبأسعار تناسب الجميع</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {FEATURES.map((f) => (
                <div key={f.title} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-3xl mb-4">{f.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{f.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="px-4 py-20 ghost-gradient text-white text-center">
          <h2 className="text-3xl font-bold mb-4">جاهز لبدء رحلتك الرقمية؟</h2>
          <p className="text-indigo-200 mb-8 max-w-xl mx-auto">انضم إلى مئات الشركات المصرية التي اختارت Wujood لبناء حضورها الرقمي</p>
          <Link href="/register"><Button variant="secondary" size="lg" className="bg-white text-indigo-700 hover:bg-indigo-50">ابدأ مجاناً — لا حاجة لبطاقة ائتمان</Button></Link>
        </section>
      </main>
      <Footer />
    </>
  )
}
