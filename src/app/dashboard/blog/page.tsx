"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, Button, Input, Badge, Spinner, useToast, Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  imageUrl: string | null;
  tags: string[];
  publishedAt: string | null;
  createdAt: string;
}

const dateFormatter = new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "numeric" });

export default function BlogDashboardPage() {
  const { toast } = useToast();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editPost, setEditPost] = useState<BlogPost | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // form state
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [publish, setPublish] = useState(false);

  const resetForm = () => { setTitle(""); setSlug(""); setContent(""); setExcerpt(""); setPublish(false); };

  const fetchPosts = useCallback(async () => {
    const res = await fetch("/api/blog");
    if (res.ok) { const d = await res.json(); setPosts(d.posts); }
  }, []);

  useEffect(() => {
    // ponytail: mount fetch inlined; setState lives in promise callbacks, not the effect body
    fetch("/api/blog")
      .then(async (res) => {
        if (res.ok) { const d = await res.json(); setPosts(d.posts); }
      })
      .finally(() => setLoading(false));
  }, []);

  async function createPost() {
    if (!title || !slug || !content) return;
    const res = await fetch("/api/blog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title, slug, content, excerpt: excerpt || undefined,
        publishedAt: publish ? new Date().toISOString() : null,
      }),
    });
    if (res.ok) { toast("Post created", "success"); resetForm(); setShowNew(false); await fetchPosts(); }
    else { const err = await res.json(); toast(err.error || "Failed", "error"); }
  }

  async function updatePost() {
    if (!editPost) return;
    const res = await fetch(`/api/blog/${editPost.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title, slug, content, excerpt: excerpt || undefined,
        publishedAt: publish ? new Date().toISOString() : null,
      }),
    });
    if (res.ok) { toast("Post updated", "success"); setEditPost(null); resetForm(); await fetchPosts(); }
    else { const err = await res.json(); toast(err.error || "Failed", "error"); }
  }

  async function deletePost() {
    if (!deleteId) return;
    const res = await fetch(`/api/blog/${deleteId}`, { method: "DELETE" });
    if (res.ok) { toast("Post deleted", "success"); setDeleteId(null); await fetchPosts(); }
    else { const err = await res.json(); toast(err.error || "Failed", "error"); }
  }

  function openEdit(post: BlogPost) {
    setEditPost(post);
    setTitle(post.title);
    setSlug(post.slug);
    setContent(post.content);
    setExcerpt(post.excerpt || "");
    setPublish(!!post.publishedAt);
  }

  function autoSlug(val: string) { setTitle(val); if (!editPost) setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")); }

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Spinner size="lg" /></div>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-1">Blog</h1>
          <p className="text-text-secondary">Manage your blog posts.</p>
        </div>
        <Button onClick={() => { resetForm(); setShowNew(true); }}>New Post</Button>
      </div>

      <Dialog open={showNew} onOpenChange={(o) => setShowNew(o)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>New Post</DialogTitle>
          </DialogHeader>
        <div className="space-y-3">
          <Input label="Title" value={title} onChange={(e) => autoSlug(e.target.value)} />
          <Input label="Slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Content</label>
            <textarea className="w-full rounded-lg border border-border-subtle bg-bg-surface px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus-visible:ring-2 focus-visible:border-accent-gold focus-visible:ring-accent-gold/20 min-h-[200px] resize-y" value={content} onChange={(e) => setContent(e.target.value)} />
          </div>
          <Input label="Excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />
          <label className="flex items-center gap-2 text-sm text-text-primary">
            <input type="checkbox" checked={publish} onChange={(e) => setPublish(e.target.checked)} className="rounded border-border-subtle" />
            Publish immediately
          </label>
          <Button onClick={createPost} disabled={!title || !slug || !content}>Create</Button>
        </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editPost} onOpenChange={(o) => { if (!o) setEditPost(null); }}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Post</DialogTitle>
          </DialogHeader>
        <div className="space-y-3">
          <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Input label="Slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Content</label>
            <textarea className="w-full rounded-lg border border-border-subtle bg-bg-surface px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus-visible:ring-2 focus-visible:border-accent-gold focus-visible:ring-accent-gold/20 min-h-[200px] resize-y" value={content} onChange={(e) => setContent(e.target.value)} />
          </div>
          <Input label="Excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />
          <label className="flex items-center gap-2 text-sm text-text-primary">
            <input type="checkbox" checked={publish} onChange={(e) => setPublish(e.target.checked)} className="rounded border-border-subtle" />
            Published
          </label>
          <div className="flex gap-2">
            <Button onClick={updatePost} disabled={!title || !slug || !content}>Save</Button>
            <Button variant="ghost" onClick={() => setEditPost(null)}>Cancel</Button>
          </div>
        </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteId} onOpenChange={(o) => { if (!o) setDeleteId(null); }}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Post</DialogTitle>
          </DialogHeader>
        <p className="text-text-secondary mb-4">Are you sure you want to delete this post? This cannot be undone.</p>
        <div className="flex gap-2">
          <Button variant="danger" onClick={deletePost}>Delete</Button>
          <Button variant="ghost" onClick={() => setDeleteId(null)}>Cancel</Button>
        </div>
        </DialogContent>
      </Dialog>

      <Card variant="elevated" padding="md">
        {posts.length === 0 ? (
          <p className="text-text-muted text-sm py-4">No posts yet.</p>
        ) : (
          <div className="space-y-3">
            {posts.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-4 rounded-lg bg-bg-elevated">
                <div className="flex-1 min-w-0 mr-4">
                  <p className="font-medium text-text-primary truncate">{p.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={p.publishedAt ? "success" : "info"} size="sm">{p.publishedAt ? "Published" : "Draft"}</Badge>
                    <span className="text-xs text-text-muted">{dateFormatter.format(new Date(p.createdAt))}</span>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button variant="ghost" size="sm" onClick={() => openEdit(p)}>Edit</Button>
                  <Button variant="danger" size="sm" onClick={() => setDeleteId(p.id)}>Delete</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
