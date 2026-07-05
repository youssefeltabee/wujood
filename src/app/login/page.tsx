import { Header } from "@/components/ui/header"
import { LoginForm } from "./login-form"

export default function LoginPage() {
  return (
    <>
      <Header />
      <main className="min-h-[70vh] flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-8">تسجيل الدخول إلى Wujood</h1>
          <LoginForm />
        </div>
      </main>
    </>
  )
}
