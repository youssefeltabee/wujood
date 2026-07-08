import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Pricing", href: "#pricing" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "FAQ", href: "#faq" },
];

export function FooterSection() {
  return (
    <footer className="border-t border-accent-gold/20 py-14 px-6 bg-bg-primary">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-2">
            <Logo />
            <p className="text-sm text-text-muted mt-4 leading-relaxed max-w-sm">Website builder, WhatsApp CRM, social media management, and AI chatbot for Egyptian SMEs. From 1,250 EGP a month.</p>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-text-primary mb-5 uppercase tracking-widest">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-text-muted hover:text-accent-gold transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-text-primary mb-5 uppercase tracking-widest">Contact</h4>
            <ul className="space-y-3 text-sm text-text-muted">
              <li>youssefeltabee@gmail.com</li>
              <li>Cairo, Egypt</li>
              <li>Sun - Thu, 9 AM - 5 PM</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border-subtle pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-muted">&copy; {new Date().getFullYear()} Wujood.</p>
          <div className="flex gap-6 text-xs text-text-muted">
            <span className="hover:text-accent-gold transition-colors cursor-default">Privacy</span>
            <span className="hover:text-accent-gold transition-colors cursor-default">Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
