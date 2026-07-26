"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/about", label: "About" },
] as const;

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-bg-primary/90 backdrop-blur-md border-b border-border-subtle">
      <div className="max-w-[80rem] mx-auto px-6 h-[var(--spacing-nav-height)] flex items-center justify-between">
        <Link href="/" className="flex-shrink-0" aria-label="Wujood Home">
          <span className="text-xl font-heading font-bold text-text-primary">Wujood</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors relative py-2",
                pathname === link.href
                  ? "text-accent-gold"
                  : "text-text-secondary hover:text-text-primary"
              )}
            >
              {link.label}
              {pathname === link.href && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-gold" />
              )}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="hidden sm:block text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="hidden sm:block bg-accent-gold text-black px-5 py-2 rounded-xl font-semibold text-sm hover:brightness-110 transition-all"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}