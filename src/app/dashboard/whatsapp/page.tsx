"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, Button, Input, Select, Badge, Spinner, useToast } from "@/components/ui";

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

  useEffect(() => { fetchTemplates().finally(() => setLoading(false)); }, [fetchTemplates]);

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

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Spinner size="lg" /></div>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-text-primary mb-1">WhatsApp</h1>
        <p className="text-text-secondary">Manage message templates.</p>
      </div>

      <Card variant="elevated" padding="md">
        <Card.Header><h2 className="text-lg font-semibold text-text-primary">New Template</h2></Card.Header>
        <Card.Body>
          <div className="space-y-3">
            <Input label="Template Name" value={name} onChange={(e) => setName(e.target.value)} />
            <Select label="Category" options={categoryOptions} value={category} onChange={(e) => setCategory(e.target.value)} />
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Content</label>
              <textarea className="w-full rounded-lg border border-border-subtle bg-bg-surface px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus-visible:ring-2 focus-visible:border-accent-gold focus-visible:ring-accent-gold/20 min-h-[120px] resize-y" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Use {{1}}, {{2}} for variables..." />
            </div>
            <Button onClick={createTemplate} disabled={!name || !content}>Create Template</Button>
          </div>
        </Card.Body>
      </Card>

      <Card variant="elevated" padding="md">
        <Card.Header><h2 className="text-lg font-semibold text-text-primary">Templates</h2></Card.Header>
        <Card.Body>
          {templates.length === 0 ? (
            <p className="text-text-muted text-sm py-4">No templates yet.</p>
          ) : (
            <div className="space-y-3">
              {templates.map((t) => (
                <div key={t.id} className="p-4 rounded-lg bg-bg-elevated">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-text-primary">{t.name}</span>
                        <Badge variant="gold" size="sm">{t.category}</Badge>
                        <Badge variant="success" size="sm">{t.language}</Badge>
                      </div>
                      <p className="text-sm text-text-secondary whitespace-pre-wrap line-clamp-2">{t.content}</p>
                    </div>
                    <Button variant="danger" size="sm" onClick={() => deleteTemplate(t.id)}>Delete</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}
