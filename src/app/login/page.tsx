"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { Card, Input, Button } from "@/components/ui";

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
    <div className="flex-1 flex items-center justify-center px-4 bg-bg-primary">
      <Card variant="elevated" padding="lg" className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-2">
            <Logo />
          </div>
          <h1 className="text-lg font-semibold text-text-primary">Welcome back to your business</h1>
          <p className="text-xs text-text-muted mt-1">تسجيل الدخول</p>
        </div>

        {error && (
          <div className="text-red-500 text-sm mb-4 text-center bg-score-low/10 rounded-lg py-2" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Email | البريد الإلكتروني"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
          <Input
            type="password"
            placeholder="Password | كلمة المرور"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
          <Button type="submit" isLoading={loading} fullWidth>
            Login | دخول
          </Button>
        </form>

        <p className="text-sm text-text-muted text-center mt-5">
          No account?{" "}
          <Link href="/register" className="text-accent-gold font-medium hover:underline">
            Register | إنشاء حساب
          </Link>
        </p>
      </Card>
    </div>
  );
}
