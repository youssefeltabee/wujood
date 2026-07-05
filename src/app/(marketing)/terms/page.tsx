import { Header } from "@/components/ui/header"
import { Footer } from "@/components/ui/footer"

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="px-4 py-16 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">شروط الخدمة</h1>
        <div className="prose prose-gray max-w-none space-y-4 text-gray-700">
          <p>باستخدامك لـ Wujood، فإنك توافق على هذه الشروط والأحكام. يرجى قراءتها بعناية.</p>
          <h2 className="text-xl font-semibold text-gray-900 mt-8">الحساب والتسجيل</h2>
          <p>يجب أن تكون مسجلاً لاستخدام خدماتنا. أنت مسؤول عن الحفاظ على سرية حسابك وكلمة المرور.</p>
          <h2 className="text-xl font-semibold text-gray-900 mt-8">الاشتراك والدفع</h2>
          <p>الاشتراك شهري ويتجدد تلقائياً. يمكنك الإلغاء في أي وقت من لوحة التحكم. يتم الدفع بالجنيه المصري عبر فوري أو بطاقة ائتمان.</p>
          <h2 className="text-xl font-semibold text-gray-900 mt-8">المحتوى</h2>
          <p>أنت تملك كل المحتوى الذي تضيفه إلى منصتك. نحن لا نطالب بأي ملكية فكرية لمحتوى موقعك.</p>
        </div>
      </main>
      <Footer />
    </>
  )
}
