"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name: name || undefined }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Registration failed"); return; }
      router.push("/dashboard");
    } catch {
      setError("Network error");
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm border rounded-xl p-6 bg-white">
        <h1 className="text-2xl font-bold text-[#1e3a5f] mb-6 text-center">Get Started</h1>
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        <input type="text" placeholder="Name (optional)" value={name} onChange={(e) => setName(e.target.value)} className="w-full border rounded-lg px-3 py-2 mb-3" />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border rounded-lg px-3 py-2 mb-3" required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border rounded-lg px-3 py-2 mb-4" required />
        <button type="submit" className="w-full bg-[#1e3a5f] text-white py-2 rounded-lg font-medium hover:bg-[#162d4a]">Create Account</button>
        <p className="text-sm text-gray-500 text-center mt-4">
          Have an account? <Link href="/login" className="text-blue-600 hover:underline">Login</Link>
        </p>
      </form>
    </div>
  );
}
