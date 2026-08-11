"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { LanguageSwitch } from "@/lib/i18n";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export function Navigation() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "glass-strong shadow-lg shadow-black/20"
            : "bg-bg-primary/80 backdrop-blur-sm"
        )}
      >
        <div className="max-w-[80rem] mx-auto px-6 h-[var(--spacing-nav-height)] flex items-center justify-between">
          <Link href="/" className="flex-shrink-0 group" aria-label="Wujood Home">
            <span className="text-xl font-heading font-bold text-text-primary group-hover:text-accent-gold transition-colors">Wujood</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-all relative px-3 py-2 rounded-lg",
                  pathname === link.href
                    ? "text-accent-gold bg-accent-gold/10"
                    : "text-text-secondary hover:text-text-primary hover:bg-white/5"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <LanguageSwitch />
            <Link
              href="/login"
              className="hidden sm:block text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="hidden sm:block bg-accent-gold text-black px-5 py-2 rounded-xl font-semibold text-sm hover:brightness-110 hover:shadow-lg hover:shadow-accent-gold/20 transition-all"
            >
              Get Started
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-text-secondary hover:text-text-primary transition-colors"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={cn(
          "fixed inset-0 z-40 md:hidden transition-all duration-300",
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
        <div
          className={cn(
            "absolute top-[var(--spacing-nav-height)] left-0 right-0 glass-strong border-b border-border-subtle transition-transform duration-300",
            mobileOpen ? "translate-y-0" : "-translate-y-full"
          )}
        >
          <div className="max-w-[80rem] mx-auto px-6 py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium px-4 py-3 rounded-xl transition-all",
                  pathname === link.href
                    ? "text-accent-gold bg-accent-gold/10"
                    : "text-text-secondary hover:text-text-primary hover:bg-white/5"
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-3 pt-3 border-t border-border-subtle flex gap-3">
              <Link
                href="/login"
                className="flex-1 text-center py-2.5 rounded-xl font-semibold text-sm border border-border-subtle text-text-primary hover:bg-white/5 transition-all"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="flex-1 text-center py-2.5 rounded-xl font-semibold text-sm bg-accent-gold text-white hover:brightness-110 transition-all"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
