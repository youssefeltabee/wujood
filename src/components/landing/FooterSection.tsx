"use client";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { useLocale } from "@/lib/i18n";

export function FooterSection() {
  const { t } = useLocale();

  const quickLinks = [
    { label: t("footer.home"), href: "/" },
    { label: t("footer.pricing"), href: "#pricing" },
    { label: t("footer.how-it-works"), href: "#how-it-works" },
    { label: t("footer.faq"), href: "#faq" },
  ];

  return (
    <footer className="relative py-14 px-6 bg-bg-primary overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-gold/40 to-transparent" />
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-2">
            <Logo />
            <p className="text-sm text-text-muted mt-4 leading-relaxed max-w-sm">{t("footer.tagline")}</p>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-text-primary mb-5 uppercase tracking-widest">{t("footer.quick-links")}</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-text-muted hover:text-accent-gold transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-text-primary mb-5 uppercase tracking-widest">{t("footer.contact")}</h4>
            <ul className="space-y-3 text-sm text-text-muted">
              <li>youssefeltabee@gmail.com</li>
              <li>Cairo, Egypt</li>
              <li>Sun - Thu, 9 AM - 5 PM</li>
            </ul>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4 mb-8 text-xs text-text-muted">
          <span className="bg-bg-elevated px-3 py-1.5 rounded-lg border border-border-subtle">سجل تجاري</span>
          <span className="bg-bg-elevated px-3 py-1.5 rounded-lg border border-border-subtle">Visa</span>
          <span className="bg-bg-elevated px-3 py-1.5 rounded-lg border border-border-subtle">Meeza</span>
          <span className="bg-bg-elevated px-3 py-1.5 rounded-lg border border-border-subtle">Fawry</span>
        </div>
        <div className="border-t border-border-subtle pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-muted">&copy; {new Date().getFullYear()} Wujood.</p>
          <div className="flex gap-6 text-xs text-text-muted">
            <span className="hover:text-accent-gold transition-colors cursor-default">{t("footer.privacy")}</span>
            <span className="hover:text-accent-gold transition-colors cursor-default">{t("footer.terms")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
