"use client";

import { useEffect, useState, useCallback } from "react";
import { Button, Input, Select, Badge, useToast } from "@/components/ui";
import { EmptyState, PageHeader } from "../_components/chrome";

interface Template {
  id: string;
  name: string;
  category: string;
  content: string;
  language: string;
  status: string;
  createdAt: string;
}

const categoryOptions = [
  { value: "marketing", label: "Marketing" },
  { value: "utility", label: "Utility" },
  { value: "authentication", label: "Authentication" },
];

export default function WhatsAppPage() {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("marketing");
  const [content, setContent] = useState("");

  const fetchTemplates = useCallback(async () => {
    const res = await fetch("/api/whatsapp/templates");
    if (res.ok) { const d = await res.json(); setTemplates(d.templates); }
  }, []);

  useEffect(() => {
    // ponytail: mount fetch inlined; setState lives in promise callbacks, not the effect body
    fetch("/api/whatsapp/templates")
      .then(async (res) => {
        if (res.ok) { const d = await res.json(); setTemplates(d.templates); }
      })
      .finally(() => setLoading(false));
  }, []);

  async function createTemplate() {
    if (!name || !content) return;
    const res = await fetch("/api/whatsapp/templates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, category, content }),
    });
    if (res.ok) { toast("Template created", "success"); setName(""); setCategory("marketing"); setContent(""); await fetchTemplates(); }
    else { const err = await res.json(); toast(err.error || "Failed", "error"); }
  }

  async function deleteTemplate(id: string) {
    const res = await fetch("/api/whatsapp/templates", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) { toast("Template deleted", "success"); await fetchTemplates(); }
    else { const err = await res.json(); toast(err.error || "Failed", "error"); }
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-lg px-6 py-10">
      <PageHeader
        eyebrow="Tools"
        title="WhatsApp"
        subtitle="Manage message templates."
      />

      <section aria-label="New template">
        <div className="card-lux p-6 hover:translate-y-0">
          <p className="section-label mb-2">Compose</p>
          <h2 className="mb-5 text-lg font-semibold text-text-primary">New Template</h2>
          <form
            onSubmit={(e) => { e.preventDefault(); createTemplate(); }}
            className="flex flex-col gap-lg"
          >
            <Input label="Template Name" value={name} onChange={(e) => setName(e.target.value)} />
            <Select label="Category" options={categoryOptions} value={category} onChange={(e) => setCategory(e.target.value)} />
            <div>
              <label htmlFor="wa-content" className="mb-1 block text-sm text-text-secondary">Content</label>
              <textarea
                id="wa-content"
                className="focus-ring-gold min-h-[120px] w-full resize-y rounded-lg border border-border-subtle bg-bg-surface px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Use {{1}}, {{2}} for variables..."
              />
            </div>
            <div>
              <Button type="submit" disabled={!name || !content}>Create Template</Button>
            </div>
          </form>
        </div>
      </section>

      <section aria-label="Templates">
        <div className="card-lux p-6 hover:translate-y-0">
          <p className="section-label mb-2">Library</p>
          <h2 className="mb-5 text-lg font-semibold text-text-primary">Templates</h2>
          {loading ? (
            <div className="space-y-2" aria-hidden="true">
              {[1, 2, 3].map((i) => <div key={i} className="skeleton h-14 rounded-xl" />)}
            </div>
          ) : templates.length === 0 ? (
            <EmptyState
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                </svg>
              }
              title="No templates yet"
              hint="Create a reusable message template above."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="table-lux w-full text-sm">
                <thead>
                  <tr>
                    <th scope="col" className="px-6 pb-3 pt-5 text-start font-medium">Name</th>
                    <th scope="col" className="px-6 pb-3 pt-5 text-start font-medium">Category</th>
                    <th scope="col" className="px-6 pb-3 pt-5 text-start font-medium">Language</th>
                    <th scope="col" className="px-6 pb-3 pt-5 text-end font-medium"><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody>
                  {templates.map((t) => (
                    <tr key={t.id}>
                      <td className="max-w-xs px-6 pe-4">
                        <p className="font-medium text-text-primary">{t.name}</p>
                        <p className="mt-0.5 line-clamp-2 text-xs text-text-secondary">{t.content}</p>
                      </td>
                      <td className="whitespace-nowrap px-6"><Badge variant="gold" size="sm">{t.category}</Badge></td>
                      <td className="whitespace-nowrap px-6"><Badge variant="info" size="sm">{t.language}</Badge></td>
                      <td className="px-6 text-end">
                        <Button variant="danger" size="sm" onClick={() => deleteTemplate(t.id)}>Delete</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
