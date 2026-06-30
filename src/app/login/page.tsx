"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Login failed"); return; }
      router.push("/dashboard");
    } catch {
      setError("Network error");
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm border rounded-xl p-6 bg-white">
        <h1 className="text-2xl font-bold text-[#1e3a5f] mb-6 text-center">Login</h1>
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border rounded-lg px-3 py-2 mb-3" required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border rounded-lg px-3 py-2 mb-4" required />
        <button type="submit" className="w-full bg-[#1e3a5f] text-white py-2 rounded-lg font-medium hover:bg-[#162d4a]">Login</button>
        <p className="text-sm text-gray-500 text-center mt-4">
          No account? <Link href="/register" className="text-blue-600 hover:underline">Register</Link>
        </p>
      </form>
    </div>
  );
}
