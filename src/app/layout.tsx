import type { Metadata } from "next";
import { Cairo, DM_Sans } from "next/font/google";
import { SmoothScroll } from "@/components/SmoothScroll";
import "./globals.css";

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
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="auto" className="dark h-full">
      <body className={`${cairo.variable} ${dmSans.variable} min-h-full flex flex-col font-body`}>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
