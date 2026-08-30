import type { Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Login | Wujood",
  description:
    "Sign in to your Wujood workspace to manage audits, catalog, social scheduling, and WhatsApp templates. Secure access for Egyptian SMEs in Arabic and English.",
  openGraph: {
    title: "Login | Wujood",
    description:
      "Sign in to your Wujood workspace to manage audits, catalog, social scheduling, and WhatsApp templates. Secure access for Egyptian SMEs in Arabic and English.",
  },
};

export default function LoginPage() {
  return <LoginForm />;
}
