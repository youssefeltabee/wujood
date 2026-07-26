import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-bg-primary">
      <div className="mb-6">
        <Logo />
      </div>
      <h1 className="text-6xl font-bold text-text-primary mb-2">404</h1>
      <p className="text-text-muted mb-8">This page does not exist.</p>
      <Link
        href="/"
        className="bg-accent-gold text-black px-6 py-2.5 rounded-xl font-semibold text-sm hover:brightness-110 transition-all"
      >
        Back to Home
      </Link>
    </div>
  );
}
