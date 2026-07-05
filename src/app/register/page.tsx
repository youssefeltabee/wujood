import { Suspense } from "react"
import { Header } from "@/components/ui/header"
import { RegisterForm } from "./register-form"

export default function RegisterPage() {
  return (
    <>
      <Header />
      <main className="min-h-[70vh] flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-8">إنشاء حساب جديد في Wujood</h1>
          <Suspense fallback={<div className="text-center text-gray-500 py-8">جارٍ التحميل...</div>}>
            <RegisterForm />
          </Suspense>
        </div>
      </main>
    </>
  )
}
