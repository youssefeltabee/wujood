import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav className="border-b border-w-sand/30 bg-white/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-4 text-sm">
            <Link href="/dashboard" className="text-w-charcoal/60 hover:text-w-charcoal transition-colors">Dashboard</Link>
            <Link href="/" className="text-w-charcoal/60 hover:text-w-charcoal transition-colors">Home</Link>
          </div>
        </div>
      </nav>
      <main className="flex-1 bg-w-cream/50">{children}</main>
    </>
  );
}
