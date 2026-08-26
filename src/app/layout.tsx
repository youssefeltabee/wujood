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
  title: {
    template: "%s | Wujood",
    default: "Wujood | Your Business, Online. In EGP. In Arabic.",
  },
  description: "Website builder, WhatsApp CRM, social media tools, and AI chatbot for Egyptian SMEs. All in EGP, all in Arabic.",
  icons: { icon: "/favicon.svg" },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // middleware guarantees the cookie on page requests; ar is the brand-default fallback
  const locale = (await cookies()).get("wujood-locale")?.value === "en" ? "en" : "ar";
  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} className={cn("dark h-full", "font-sans", geist.variable)}>
      <body className={`${cairo.variable} ${dmSans.variable} min-h-full flex flex-col font-body`}>
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
