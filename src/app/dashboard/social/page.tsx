"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, Button, Input, Select, Badge, Spinner, useToast } from "@/components/ui";

interface SocialAccount {
  id: string;
  platform: string;
  handle: string | null;
  isActive: boolean;
}

interface SocialPost {
  id: string;
  accountId: string;
  content: string;
  mediaUrls: string[];
  scheduledAt: string | null;
  postedAt: string | null;
  status: string;
  account: { platform: string; handle: string | null };
  analytics: { likes: number; shares: number; comments: number; clicks: number; reach: number } | null;
}

const statusVariant: Record<string, "success" | "warning" | "info" | "default"> = {
  published: "success",
  scheduled: "warning",
  draft: "info",
};

const platforms = [
  { value: "twitter", label: "Twitter / X" },
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "tiktok", label: "TikTok" },
];

export default function SocialPage() {
  const { toast } = useToast();
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [platform, setPlatform] = useState("");
  const [handle, setHandle] = useState("");
  const [content, setContent] = useState("");
  const [selectedAccount, setSelectedAccount] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchAccounts = useCallback(async () => {
    const res = await fetch("/api/social");
    if (res.ok) {
      const data = await res.json();
      setAccounts(data.accounts);
    }
  }, []);

  const fetchPosts = useCallback(async () => {
    const params = new URLSearchParams();
    if (statusFilter) params.set("status", statusFilter);
    const res = await fetch(`/api/social/posts?${params}`);
    if (res.ok) {
      const data = await res.json();
      setPosts(data.posts);
    }
  }, [statusFilter]);

  useEffect(() => {
    Promise.all([fetchAccounts(), fetchPosts()]).finally(() => setLoading(false));
  }, [fetchAccounts, fetchPosts]);

  async function addAccount() {
    if (!platform) return;
    const res = await fetch("/api/social", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ platform, handle }),
    });
    if (res.ok) {
      toast("Account added", "success");
      setPlatform("");
      setHandle("");
      await fetchAccounts();
    } else {
      const err = await res.json();
      toast(err.error || "Failed to add account", "error");
    }
  }

  async function removeAccount(id: string) {
    const res = await fetch(`/api/social/accounts/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast("Account removed", "success");
      await fetchAccounts();
    }
  }

  async function createPost() {
    if (!selectedAccount || !content) return;
    const res = await fetch("/api/social/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        accountId: selectedAccount,
        content,
        scheduledAt: scheduledAt || undefined,
      }),
    });
    if (res.ok) {
      toast("Post created", "success");
      setContent("");
      setScheduledAt("");
      await fetchPosts();
    } else {
      const err = await res.json();
      toast(err.error || "Failed to create post", "error");
    }
  }

  async function deletePost(id: string) {
    const res = await fetch(`/api/social/posts/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast("Post deleted", "success");
      await fetchPosts();
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-text-primary mb-1">Social Commander</h1>
        <p className="text-text-secondary">Manage connected accounts and scheduled posts.</p>
      </div>

      <Card variant="elevated" padding="md">
        <Card.Header>
          <h2 className="text-lg font-semibold text-text-primary">Connected Accounts</h2>
        </Card.Header>
        <Card.Body>
          {accounts.length === 0 ? (
            <p className="text-text-muted text-sm py-4">No accounts connected yet.</p>
          ) : (
            <div className="space-y-2 mb-4">
              {accounts.map((a) => (
                <div key={a.id} className="flex items-center justify-between py-2 px-3 rounded-lg bg-bg-elevated">
                  <div className="flex items-center gap-3">
                    <Badge variant="gold" size="sm">{a.platform}</Badge>
                    <span className="text-sm text-text-primary">{a.handle || "—"}</span>
                  </div>
                  <Button variant="danger" size="sm" onClick={() => removeAccount(a.id)}>Remove</Button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-end gap-3 pt-3 border-t border-border-subtle">
            <Select
              options={platforms}
              placeholder="Select platform"
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
            />
            <Input
              placeholder="Handle (optional)"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
            />
            <Button onClick={addAccount} disabled={!platform}>Connect</Button>
          </div>
        </Card.Body>
      </Card>

      <Card variant="elevated" padding="md">
        <Card.Header>
          <h2 className="text-lg font-semibold text-text-primary">Create Post</h2>
        </Card.Header>
        <Card.Body>
          <div className="space-y-3">
            <Select
              options={accounts.map((a) => ({ value: a.id, label: `${a.platform}${a.handle ? ` (${a.handle})` : ""}` }))}
              placeholder="Select account"
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
            />
            <textarea
              className="w-full rounded-lg border border-border-subtle bg-bg-surface px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus-visible:ring-2 focus-visible:border-accent-gold focus-visible:ring-accent-gold/20 min-h-[100px] resize-y"
              placeholder="Write your post content..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <Input
              type="datetime-local"
              label="Schedule (optional)"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
            />
            <Button onClick={createPost} disabled={!selectedAccount || !content}>
              {scheduledAt ? "Schedule Post" : "Save Draft"}
            </Button>
          </div>
        </Card.Body>
      </Card>

      <Card variant="elevated" padding="md">
        <Card.Header>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-text-primary">Posts</h2>
            <Select
              options={[
                { value: "", label: "All" },
                { value: "draft", label: "Drafts" },
                { value: "scheduled", label: "Scheduled" },
                { value: "published", label: "Published" },
              ]}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-40"
            />
          </div>
        </Card.Header>
        <Card.Body>
          {posts.length === 0 ? (
            <p className="text-text-muted text-sm py-4">No posts yet.</p>
          ) : (
            <div className="space-y-3">
              {posts.map((p) => (
                <div key={p.id} className="p-4 rounded-lg bg-bg-elevated space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-text-primary whitespace-pre-wrap line-clamp-3">{p.content}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="gold" size="sm">{p.account.platform}</Badge>
                        <Badge variant={statusVariant[p.status] || "default"} size="sm">{p.status}</Badge>
                      </div>
                      {p.scheduledAt && (
                        <p className="text-xs text-text-muted mt-1">
                          Scheduled: {new Date(p.scheduledAt).toLocaleString()}
                        </p>
                      )}
                      {p.postedAt && (
                        <p className="text-xs text-text-muted mt-1">
                          Posted: {new Date(p.postedAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                    <Button variant="danger" size="sm" onClick={() => deletePost(p.id)}>Delete</Button>
                  </div>
                  {p.analytics && p.status === "published" && (
                    <div className="flex gap-4 pt-2 border-t border-border-subtle text-xs text-text-secondary">
                      <span>Likes: {p.analytics.likes}</span>
                      <span>Shares: {p.analytics.shares}</span>
                      <span>Comments: {p.analytics.comments}</span>
                      <span>Clicks: {p.analytics.clicks}</span>
                      <span>Reach: {p.analytics.reach}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}
