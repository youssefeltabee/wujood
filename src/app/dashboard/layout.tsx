"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "@/components/ui/Logo";
import DashboardClientWrapper from "@/components/DashboardClientWrapper";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me").then(async (r) => {
      if (r.ok) { const d = await r.json(); setIsAdmin(d.user?.role === "admin"); }
    }).catch(() => {});
  }, []);

  return (
    <DashboardClientWrapper>
      <nav className="border-b border-border-subtle bg-bg-surface/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-4 text-sm">
            <Link href="/dashboard" className="text-text-secondary hover:text-text-primary transition-colors">Dashboard</Link>
            <Link href="/dashboard/website" className="text-text-secondary hover:text-text-primary transition-colors">Website</Link>
            <Link href="/dashboard/social" className="text-text-secondary hover:text-text-primary transition-colors">Social</Link>
            <Link href="/dashboard/blog" className="text-text-secondary hover:text-text-primary transition-colors">Blog</Link>
            <Link href="/dashboard/whatsapp" className="text-text-secondary hover:text-text-primary transition-colors">WhatsApp</Link>
            <Link href="/dashboard/onboarding" className="text-text-secondary hover:text-text-primary transition-colors">Setup</Link>
            {isAdmin && <Link href="/dashboard/admin" className="text-text-secondary hover:text-text-primary transition-colors">Admin</Link>}
            <Link href="/" className="text-text-secondary hover:text-text-primary transition-colors">Home</Link>
          </div>
        </div>
      </nav>
      <main className="flex-1 bg-bg-primary">{children}</main>
    </DashboardClientWrapper>
  );
}
