"use client";

import { useEffect, useState } from "react";
import { Button, Input, Card, Badge, useToast } from "@/components/ui";

interface Website {
  id: string;
  title: string | null;
  description: string | null;
  domain: string | null;
  colors: Record<string, string> | null;
  isPublished: boolean;
  pages: unknown[];
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

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-bg-elevated rounded w-48" />
          <div className="h-24 bg-bg-elevated rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-text-primary">{website ? "Your Site" : "Create Your Site"}</h1>
        {website && (
          <div className="flex items-center gap-3">
            <Badge variant={website.isPublished ? "success" : "warning"}>
              {website.isPublished ? "Published" : "Draft"}
            </Badge>
            {website.isPublished && website.domain && (
              <a
                href={`https://${website.domain}.wujood-app.vercel.app`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-accent-gold hover:underline"
              >
                View site &rarr;
              </a>
            )}
          </div>
        )}
      </div>

      <Card variant="elevated" padding="lg" className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">Site Title</label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="My Business" />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">Description</label>
          <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="A short description of your business" />
        </div>

        {website && (
          <>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Subdomain</label>
              <div className="flex items-center gap-2">
                <Input value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="my-business" className="font-mono" />
                <span className="text-sm text-text-muted shrink-0">.wujood-app.vercel.app</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Primary Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="size-8 rounded border border-border-subtle cursor-pointer shrink-0"
                  />
                  <Input value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="font-mono text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Background Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="size-8 rounded border border-border-subtle cursor-pointer shrink-0"
                  />
                  <Input value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} className="font-mono text-sm" />
                </div>
              </div>
            </div>
          </>
        )}

        <div className="flex gap-3 pt-2">
          <Button onClick={handleSave} disabled={saving || !title.trim()}>
            {saving ? "Saving..." : website ? "Save Changes" : "Create Site"}
          </Button>
          {website && (
            <Button variant="secondary" onClick={togglePublish} disabled={saving}>
              {website.isPublished ? "Unpublish" : "Publish"}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
