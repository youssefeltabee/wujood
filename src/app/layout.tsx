import type { Metadata } from "next";
import { Cairo, DM_Sans, Geist } from "next/font/google";
import { cookies } from "next/headers";
import { SmoothScroll } from "@/components/SmoothScroll";
import { LocaleProvider } from "@/lib/i18n";
import { RTLProvider } from "@/components/RTLProvider";
import { Providers } from "./providers";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://wujood-opal.vercel.app"),
  title: {
    template: "%s | Wujood",
    default: "Wujood | Your Business, Online. In EGP. In Arabic.",
  },
  description: "Website builder, WhatsApp CRM, social media tools, and AI chatbot for Egyptian SMEs. All in EGP, all in Arabic.",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "Wujood | Your Business, Online. In EGP. In Arabic.",
    description: "Website builder, WhatsApp CRM, social media tools, and AI chatbot for Egyptian SMEs. From 1,250 EGP/month.",
    url: "https://wujood-opal.vercel.app",
    siteName: "Wujood",
    locale: "ar_EG",
    alternateLocale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wujood | Your Business, Online.",
    description: "Website builder, WhatsApp CRM, social media tools for Egyptian SMEs.",
  },
  alternates: { canonical: "/" },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // middleware guarantees the cookie on page requests; ar is the brand-default fallback
  const locale = (await cookies()).get("wujood-locale")?.value === "en" ? "en" : "ar";
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Wujood",
    alternateName: "وجود",
    url: "https://wujood-opal.vercel.app",
    logo: "https://wujood-opal.vercel.app/favicon.svg",
    description: "Website builder, WhatsApp CRM, social media tools, and AI chatbot for Egyptian SMEs. From 1,250 EGP/month.",
    address: { "@type": "PostalAddress", addressLocality: "Cairo", addressCountry: "EG" },
    contactPoint: { "@type": "ContactPoint", email: "youssefeltabee@gmail.com", contactType: "customer support" },
  };
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      { "@type": "Question", name: "هل أحتاج مهارات تقنية لاستخدام Wujood؟", acceptedAnswer: { "@type": "Answer", text: "لا. احنا بنضبطلك كل حاجة. أنت بس قولنا محتاج إيه واحنا نعمل الباقي." } },
      { "@type": "Question", name: "هل أقدر ألغي في أي وقت؟", acceptedAnswer: { "@type": "Answer", text: "أيوه. مفيش عقود ولا رسوم إلغاء. كل اللي بنيناه يفضل معاك." } },
      { "@type": "Question", name: "لو عندي موقع بالفعل؟", acceptedAnswer: { "@type": "Answer", text: "نقدر نشتغل على موقعك الحالي أو نبني واحد جديد. ابدأ بتدقيق مجاني تشوف وضعك فين." } },
      { "@type": "Question", name: "بتشتغلوا مع بره القاهرة؟", acceptedAnswer: { "@type": "Answer", text: "بنشتغل مع شركات مصرية في كل مكان. المنصة كلها remote." } },
      { "@type": "Question", name: "الدعم متوفر بالعربي؟", acceptedAnswer: { "@type": "Answer", text: "أيوه. فريقنا بيتكلم عربي وإنجليزي. الدعم مشمول في كل الخطط." } },
    ],
  };
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Wujood",
    description: "Digital presence platform for Egyptian SMEs",
    brand: { "@type": "Brand", name: "Wujood" },
    offers: [
      { "@type": "Offer", name: "Kashif — كاشف", price: "1250", priceCurrency: "EGP", availability: "https://schema.org/InStock", url: "https://wujood-opal.vercel.app/pricing" },
      { "@type": "Offer", name: "Sane' — صانع", price: "2500", priceCurrency: "EGP", availability: "https://schema.org/InStock", url: "https://wujood-opal.vercel.app/pricing" },
      { "@type": "Offer", name: "Ra'ed — رائد", price: "4500", priceCurrency: "EGP", availability: "https://schema.org/InStock", url: "https://wujood-opal.vercel.app/pricing" },
    ],
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://wujood-opal.vercel.app/" },
      { "@type": "ListItem", position: 2, name: "Features", item: "https://wujood-opal.vercel.app/features" },
      { "@type": "ListItem", position: 3, name: "Pricing", item: "https://wujood-opal.vercel.app/pricing" },
    ],
  };
  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} className={cn("dark h-full", "font-sans", geist.variable)}>
      <body className={`${cairo.variable} ${dmSans.variable} min-h-full flex flex-col font-body`}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
        <Providers>
          <LocaleProvider initialLocale={locale}>
            <RTLProvider>
              <SmoothScroll>{children}</SmoothScroll>
            </RTLProvider>
          </LocaleProvider>
        </Providers>
      </body>
    </html>
  );
}
