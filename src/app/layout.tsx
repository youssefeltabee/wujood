import type { Metadata } from "next";
import { Inter, Cairo } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const cairo = Cairo({ subsets: ["arabic"], variable: "--font-cairo" });

export const metadata: Metadata = {
  title: "Wujood — حول نشاطك التجاري من شبح رقمي إلى كيان رقمي",
  description: "Wujood helps Egyptian SMEs build a powerful digital presence. Website builder, WhatsApp CRM, social media management — all in one EGP-priced platform.",
  keywords: ["digital presence", "website builder Egypt", "WhatsApp CRM", "SME digital transformation", "وجود"],
  openGraph: {
    title: "Wujood — Digital Presence for Egyptian SMEs",
    description: "Stop being a digital ghost. Build your online presence in days, not months.",
    locale: "ar_EG",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl" className={`${inter.variable} ${cairo.variable}`}>
      <body className="font-cairo min-h-screen bg-white text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
