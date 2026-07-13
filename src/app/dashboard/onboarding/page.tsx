"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, Button, Input, Select, Spinner, useToast } from "@/components/ui";

const businessTypes = [
  { value: "retail", label: "Retail" },
  { value: "services", label: "Services" },
  { value: "technology", label: "Technology" },
  { value: "food", label: "Food & Beverage" },
  { value: "healthcare", label: "Healthcare" },
  { value: "education", label: "Education" },
  { value: "real_estate", label: "Real Estate" },
  { value: "other", label: "Other" },
];

const companySizes = [
  { value: "1", label: "Solo (1)" },
  { value: "2-10", label: "Micro (2-10)" },
  { value: "11-50", label: "Small (11-50)" },
  { value: "51-200", label: "Medium (51-200)" },
  { value: "201+", label: "Large (201+)" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [auditUrl, setAuditUrl] = useState("");
  const [auditRunning, setAuditRunning] = useState(false);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    fetch("/api/auth/me").then(async (r) => {
      if (!r.ok) { router.push("/login"); return; }
      const data = await r.json();
      if (data.user?.companyName) { router.push("/dashboard"); return; }
      setLoading(false);
    });
  }, [router]);

  useEffect(() => {
    if (step === 3 && countdown > 0) {
      const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
      if (countdown === 1) router.push("/dashboard");
      return () => clearTimeout(t);
    }
  }, [step, countdown, router]);

  const saveCompanyInfo = async () => {
    if (!companyName.trim()) { toast("Company name is required", "error"); return; }
    setSaving(true);
    const res = await fetch("/api/auth/me", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ companyName: companyName.trim(), businessType, companySize }),
    });
    if (res.ok) { setStep(2); } else { toast("Failed to save company info", "error"); }
    setSaving(false);
  };

  const runAudit = async () => {
    if (!auditUrl.trim()) { setStep(3); return; }
    setAuditRunning(true);
    const res = await fetch("/api/audit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: auditUrl.trim() }),
    });
    if (res.ok) { toast("Audit started successfully!", "success"); }
    else { toast("Failed to start audit", "error"); }
    setAuditRunning(false);
    setStep(3);
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  return (
    <div className="max-w-lg mx-auto px-6 py-16">
      <div className="flex justify-center gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className={`size-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= s ? "bg-accent-gold text-bg-primary" : "bg-bg-elevated text-text-muted"}`}>
            {s}
          </div>
        ))}
      </div>

      {step === 1 && (
        <Card variant="elevated" padding="lg">
          <h2 className="text-xl font-bold text-text-primary mb-1">Welcome to Wujood</h2>
          <p className="text-text-secondary text-sm mb-6">Tell us about your business to get started.</p>
          <div className="space-y-4">
            <Input label="Company Name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Your business name" />
            <Select label="Business Type" options={businessTypes} value={businessType} onChange={(e) => setBusinessType(e.target.value)} placeholder="Select type" />
            <Select label="Company Size" options={companySizes} value={companySize} onChange={(e) => setCompanySize(e.target.value)} placeholder="Select size" />
            <Button onClick={saveCompanyInfo} disabled={saving} className="w-full">
              {saving ? "Saving..." : "Continue"}
            </Button>
          </div>
        </Card>
      )}

      {step === 2 && (
        <Card variant="elevated" padding="lg">
          <h2 className="text-xl font-bold text-text-primary mb-1">First Audit</h2>
          <p className="text-text-secondary text-sm mb-6">Run your first website audit or skip for now.</p>
          <div className="space-y-4">
            <Input label="Website URL" value={auditUrl} onChange={(e) => setAuditUrl(e.target.value)} placeholder="https://example.com" />
            <div className="flex gap-3">
              <Button onClick={runAudit} disabled={auditRunning} className="flex-1">
                {auditRunning ? "Running..." : "Run Audit"}
              </Button>
              <Button variant="secondary" onClick={() => setStep(3)} className="flex-1">
                Skip
              </Button>
            </div>
          </div>
        </Card>
      )}

      {step === 3 && (
        <Card variant="elevated" padding="lg" className="text-center">
          <svg className="size-16 mx-auto text-score-high mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-xl font-bold text-text-primary mb-1">You're All Set!</h2>
          <p className="text-text-secondary text-sm mb-2">Your Wujood account is ready to go.</p>
          <p className="text-text-muted text-xs">Redirecting to dashboard in {countdown}s...</p>
        </Card>
      )}
    </div>
  );
}
