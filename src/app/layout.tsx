import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wujood | From Digital Ghost to Digital Presence",
  description: "All-in-one digital presence platform for Egyptian SMEs. Website builder, WhatsApp CRM, social media management, and AI chatbot — priced in EGP, designed in Arabic.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="auto" className="h-full">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
