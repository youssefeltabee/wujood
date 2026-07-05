import { Header } from "@/components/ui/header"
import { Footer } from "@/components/ui/footer"

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="px-4 py-16 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">سياسة الخصوصية</h1>
        <div className="prose prose-gray max-w-none space-y-4 text-gray-700">
          <p>نحن في Wujood نأخذ خصوصيتك على محمل الجد. توضح سياسة الخصوصية هذه كيفية جمع واستخدام وحماية معلوماتك الشخصية.</p>
          <h2 className="text-xl font-semibold text-gray-900 mt-8">المعلومات التي نجمعها</h2>
          <p>عند التسجيل، نجمع: الاسم، البريد الإلكتروني، رقم الهاتف، ومعلومات الدفع. نستخدم هذه المعلومات لتقديم خدماتنا وتحسينها.</p>
          <h2 className="text-xl font-semibold text-gray-900 mt-8">كيف نستخدم معلوماتك</h2>
          <p>نستخدم معلوماتك لتشغيل المنصة، تحسين خدماتنا، إرسال تحديثات، ودعم عملائنا. لن نشارك معلوماتك مع أطراف ثالثة إلا للضرورة القانونية أو التقنية. نستخدم تشفير SSL لحماية بياناتك، ونتخذ إجراءات أمنية مشددة.</p>
        </div>
      </main>
      <Footer />
    </>
  )
}
