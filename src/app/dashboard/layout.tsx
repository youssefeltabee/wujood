import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import DashboardClientWrapper from "@/components/DashboardClientWrapper";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardClientWrapper>
      <nav className="border-b border-border-subtle bg-bg-surface/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-4 text-sm">
            <Link href="/dashboard" className="text-text-secondary hover:text-text-primary transition-colors">Dashboard</Link>
            <Link href="/dashboard/social" className="text-text-secondary hover:text-text-primary transition-colors">Social</Link>
            <Link href="/" className="text-text-secondary hover:text-text-primary transition-colors">Home</Link>
          </div>
        </div>
      </nav>
      <main className="flex-1 bg-bg-primary">{children}</main>
    </DashboardClientWrapper>
  );
}
