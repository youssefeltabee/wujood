"use client";

import { useEffect, useState } from "react";
import { Button, Input, Badge, useToast } from "@/components/ui";
import { PageHeader } from "../_components/chrome";

interface Website {
  id: string;
  title: string | null;
  description: string | null;
  domain: string | null;
  colors: Record<string, string> | null;
  isPublished: boolean;
  pages: unknown[];
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="mb-1 block text-sm text-text-secondary">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label={label}
          className="focus-ring-gold size-8 shrink-0 cursor-pointer rounded border border-border-subtle"
        />
        <Input value={value} onChange={(e) => onChange(e.target.value)} className="font-mono text-sm" />
      </div>
    </div>
  );
}

export default function WebsiteDashboardPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [website, setWebsite] = useState<Website | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [domain, setDomain] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#1f2937");
  const [secondaryColor, setSecondaryColor] = useState("#f9fafb");

  useEffect(() => {
    fetch("/api/website")
      .then(async (r) => {
        if (r.status === 401) { window.location.href = "/login"; return; }
        if (!r.ok) throw new Error("Failed to fetch");
        return r.json();
      })
      .then((d) => {
        if (d?.website) {
          setWebsite(d.website);
          setTitle(d.website.title || "");
          setDescription(d.website.description || "");
          setDomain(d.website.domain || "");
          const c = d.website.colors || {};
          if (c.primary) setPrimaryColor(c.primary);
          if (c.secondary) setSecondaryColor(c.secondary);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const method = website ? "PUT" : "POST";
      const body: Record<string, unknown> = { title, description };
      if (website) {
        body.domain = domain;
        body.colors = { primary: primaryColor, secondary: secondaryColor };
      }
      const res = await fetch("/api/website", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      setWebsite(data.website);
      toast(website ? "Site updated" : "Site created", "success");
    } catch (e: unknown) {
      toast(e instanceof Error ? e.message : "Something went wrong", "error");
    } finally {
      setSaving(false);
    }
  };

  const togglePublish = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/website", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !website?.isPublished }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update");
      setWebsite(data.website);
      toast(data.website.isPublished ? "Site published" : "Site unpublished", "success");
    } catch (e: unknown) {
      toast(e instanceof Error ? e.message : "Something went wrong", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-10">
      {loading ? (
        <div aria-hidden="true">
          <div className="skeleton mb-2 h-4 w-24 rounded" />
          <div className="skeleton mb-8 h-9 w-64 rounded-lg" />
          <div className="skeleton h-96 rounded-2xl" />
        </div>
      ) : (
        <>
          <PageHeader
            eyebrow="Tools"
            title={website ? "Your Site" : "Create Your Site"}
            subtitle={website?.isPublished ? undefined : website ? "Draft — publish when ready." : undefined}
            action={
              website && (
                <div className="flex items-center gap-3">
                  <Badge variant={website.isPublished ? "success" : "warning"}>
                    <span className="inline-flex items-center gap-1.5">
                      <span className={`size-1.5 rounded-full ${website.isPublished ? "bg-accent-cyan" : "bg-score-mid"}`} />
                      {website.isPublished ? "Live" : "Draft"}
                    </span>
                  </Badge>
                  {website.isPublished && website.domain && (
                    <a
                      href={`https://${website.domain}.wujood.vercel.app`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-accent-gold hover:underline"
                    >
                      View site &rarr;
                    </a>
                  )}
                </div>
              )
            }
          />

          <form
            onSubmit={(e) => { e.preventDefault(); handleSave(); }}
            className="card-lux flex flex-col gap-8 p-6 hover:translate-y-0 md:p-8"
          >
            <Input
              label="Site Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="My Business"
              required
            />
            <Input
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A short description of your business"
            />

            {website && (
              <>
                <div>
                  <label htmlFor="site-domain" className="mb-1 block text-sm text-text-secondary">Subdomain</label>
                  <div className="flex items-center gap-2">
                    <Input id="site-domain" value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="my-business" className="font-mono" />
                    <span className="shrink-0 text-sm text-text-muted">.wujood.vercel.app</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                  <ColorField label="Primary Color" value={primaryColor} onChange={setPrimaryColor} />
                  <ColorField label="Background Color" value={secondaryColor} onChange={setSecondaryColor} />
                </div>
              </>
            )}

            <div className="flex flex-wrap gap-3 pt-2">
              <Button type="submit" disabled={saving || !title.trim()}>
                {saving ? "Saving..." : website ? "Save Changes" : "Create Site"}
              </Button>
              {website && (
                <Button type="button" variant="secondary" onClick={togglePublish} disabled={saving}>
                  {website.isPublished ? "Unpublish" : "Publish"}
                </Button>
              )}
            </div>
          </form>
        </>
      )}
    </div>
  );
}
