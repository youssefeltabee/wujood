import Link from "next/link";
import { siteConfig } from "@/config/site";
import { AuditForm } from "@/components/audit/AuditForm";

export default function LandingPage() {
  return (
    <>
      <nav className="border-b bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-[#1e3a5f]">Wujood</Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">Login</Link>
            <Link href="/register" className="text-sm bg-[#1e3a5f] text-white px-4 py-2 rounded-lg hover:bg-[#162d4a]">Get Started</Link>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        <section className="py-20 md:py-32 px-4 text-center bg-gradient-to-b from-[#f8f6f2] to-white">
          <h1 className="text-4xl md:text-6xl font-bold text-[#1e3a5f] mb-4 leading-tight">
            From Digital Ghost<br />to <span className="text-[#c9a84c]">Digital Presence</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            {siteConfig.description}
          </p>
          <div className="max-w-xl mx-auto mb-4">
            <AuditForm />
          </div>
          <p className="text-sm text-gray-400">Enter your website URL for a free Digital Ghost Audit</p>
        </section>

        <section className="py-16 px-4 bg-white" id="pricing">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-[#1e3a5f] mb-12">Pricing Plans</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {siteConfig.tiers.map((tier) => (
                <div key={tier.id} className={`border rounded-xl p-6 ${tier.popular ? "border-[#c9a84c] ring-2 ring-[#c9a84c]/20" : "border-gray-200"}`}>
                  {tier.popular && <span className="text-xs font-semibold text-[#c9a84c] uppercase tracking-wide">Most Popular</span>}
                  <h3 className="text-xl font-bold mt-2">{tier.name.en} | {tier.name.ar}</h3>
                  <p className="text-gray-500 text-sm mb-4">{tier.target.en}</p>
                  <div className="text-3xl font-bold text-[#1e3a5f] mb-6">
                    {tier.price.toLocaleString()} <span className="text-lg font-normal text-gray-500">EGP/{tier.period}</span>
                  </div>
                  <ul className="space-y-2 mb-6">
                    {tier.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-green-500 mt-0.5">✓</span> {f.en}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/register"
                    className={`block text-center py-2 rounded-lg font-medium ${tier.popular ? "bg-[#1e3a5f] text-white hover:bg-[#162d4a]" : "border border-gray-300 text-gray-700 hover:bg-gray-50"}`}
                  >
                    Get Started
                  </Link>
                </div>
              ))}
            </div>
            <p className="text-center text-sm text-gray-400 mt-6">Annual billing: 10 months for 12 (17% discount). 7-day free trial on all plans.</p>
          </div>
        </section>

        <section className="py-16 px-4 bg-[#f8f6f2]">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-[#1e3a5f] mb-4">What is the Digital Ghost Syndrome?</h2>
            <p className="text-gray-600 leading-relaxed">
              80% of Egyptian B2B companies have an online presence but are effectively invisible — 
              with outdated websites, dormant social media, no pricing, and no online payments. 
              This represents <strong>$3.5-4.5 billion</strong> in unrealized annual potential. 
              Wujood changes that — all in EGP, all in Arabic.
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t py-8 px-4 text-center text-sm text-gray-400">
        <p>© {new Date().getFullYear()} Wujood. Built for Egyptian SMEs.</p>
      </footer>
    </>
  );
}
