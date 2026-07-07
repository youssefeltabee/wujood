import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-w-cream">
      <div className="mb-6">
        <Logo />
      </div>
      <h1 className="text-6xl font-bold text-w-charcoal mb-2">404</h1>
      <p className="text-w-charcoal/50 mb-8">This page does not exist.</p>
      <Link
        href="/"
        className="bg-w-teal text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-w-teal-dark transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
}
