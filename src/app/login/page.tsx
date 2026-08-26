"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { GeometricPattern } from "@/components/ui/GeometricPattern";
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
    <div className="flex min-h-dvh bg-bg-primary">
      {/* Brand panel */}
      <aside className="relative hidden w-1/2 items-center overflow-hidden border-e border-border-subtle bg-bg-surface lg:flex" aria-hidden="true">
        <div className="pattern-fade absolute inset-0">
          <GeometricPattern opacity={0.06} />
        </div>
        <div className="relative z-10 max-w-md px-12">
          <p className="section-label mb-4">Wujood &middot; وجود</p>
          <h2 className="text-4xl font-bold leading-tight text-text-primary">
            Every great business leaves a trace.
          </h2>
          <p className="mt-4 text-text-secondary">
            Sign in to your workshop — audits, catalog, social and WhatsApp,
            all in one calm charcoal room.
          </p>
          <div className="mt-8 flex items-center gap-3 text-sm text-text-muted">
            <span className="inline-block size-1.5 rounded-full bg-accent-gold" />
            Presence engineering, measured.
          </div>
        </div>
      </aside>

      {/* Form panel */}
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <Card variant="bordered" padding="lg" className="glass-panel w-full max-w-sm rounded-2xl shadow-lg">
          <div className="mb-8 text-center">
            <div className="mb-2 flex justify-center">
              <Logo />
            </div>
            <h1 className="text-lg font-semibold text-text-primary">Welcome back to your business</h1>
            <p className="mt-1 text-xs text-text-muted">تسجيل الدخول</p>
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-score-low/10 py-2 text-center text-sm text-red-500" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
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

          <p className="mt-5 text-center text-sm text-text-muted">
            No account?{" "}
            <Link href="/register" className="font-medium text-accent-gold hover:underline focus-ring-gold rounded">
              Register | إنشاء حساب
            </Link>
          </p>
        </Card>
      </main>
    </div>
  );
}
