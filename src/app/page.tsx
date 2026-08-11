import type { Metadata } from "next";
import { Navigation } from "@/components/navigation/Navigation";
import LandingClient from "@/components/LandingClient";

export const metadata: Metadata = {
  title: "Home",
  description: "Website builder, WhatsApp CRM, social media tools, and AI chatbot for Egyptian SMEs. All in EGP, all in Arabic.",
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <Navigation />
      <div className="pt-[var(--spacing-nav-height)]">
        <LandingClient />
      </div>
    </div>
  );
}