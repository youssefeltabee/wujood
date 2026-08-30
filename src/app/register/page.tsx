import type { Metadata } from "next";
import RegisterForm from "./RegisterForm";

export const metadata: Metadata = {
  title: "Register | Wujood",
  description:
    "Create your free Wujood account and claim your corner of the internet. Unlock audits, catalog, social scheduling and WhatsApp tools for Egyptian SMEs instantly.",
  openGraph: {
    title: "Register | Wujood",
    description:
      "Create your free Wujood account and claim your corner of the internet. Unlock audits, catalog, social scheduling and WhatsApp tools for Egyptian SMEs instantly.",
  },
};

export default function RegisterPage() {
  return <RegisterForm />;
}
