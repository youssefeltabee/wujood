"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Login failed"); setLoading(false); return; }
      router.push("/dashboard");
    } catch {
      setError("Network error");
      setLoading(false);
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center px-4 bg-w-cream">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white border border-w-sand/30 rounded-2xl p-8 shadow-sm">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-2">
            <Logo />
          </div>
          <h1 className="text-lg font-semibold text-w-charcoal">Welcome back to your business</h1>
          <p className="text-xs text-w-charcoal/40 mt-1">تسجيل الدخول</p>
        </div>
        {error && <p className="text-red-500 text-sm mb-4 text-center bg-red-50 rounded-lg py-2">{error}</p>}
        <input type="email" placeholder="Email | البريد الإلكتروني" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-w-sand/50 rounded-xl px-3 py-2.5 mb-3 text-sm focus:border-w-teal focus:outline-none focus:ring-2 focus:ring-w-teal/20" autoComplete="email" required />
        <input type="password" placeholder="Password | كلمة المرور" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border border-w-sand/50 rounded-xl px-3 py-2.5 mb-5 text-sm focus:border-w-teal focus:outline-none focus:ring-2 focus:ring-w-teal/20" autoComplete="current-password" required />
        <button type="submit" disabled={loading} className="w-full bg-w-teal text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-w-teal-dark disabled:opacity-60 transition-colors">Login | دخول</button>
        <p className="text-sm text-w-charcoal/40 text-center mt-5">
          No account?{" "}
          <Link href="/register" className="text-w-teal font-medium hover:underline">Register | إنشاء حساب</Link>
        </p>
      </form>
    </div>
  );
}
