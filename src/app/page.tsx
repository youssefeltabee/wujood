import type { Metadata } from "next";
import LandingClient from "@/components/LandingClient";

export const metadata: Metadata = {
  title: "Digital Ghost Audit for Egyptian SMEs | Wujood",
};

export default function LandingPage() {
  return <LandingClient />;
}
