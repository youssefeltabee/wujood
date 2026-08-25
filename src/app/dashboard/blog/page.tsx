"use client";

import { useEffect, useState, useCallback } from "react";
import { Button, Input, Badge, useToast, Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui";
import { EmptyState, PageHeader } from "../_components/chrome";

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

interface PostFormState {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  publish: boolean;
}

function PostFormFields({
  form,
  setForm,
  onTitleChange,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  form: PostFormState;
  setForm: (patch: Partial<PostFormState>) => void;
  onTitleChange: (val: string) => void;
  submitLabel: string;
  onSubmit: () => void;
  onCancel: () => void;
}) {
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSubmit(); }}
      className="flex flex-col gap-lg"
    >
      <Input label="Title" value={form.title} onChange={(e) => onTitleChange(e.target.value)} />
      <Input label="Slug" value={form.slug} onChange={(e) => setForm({ slug: e.target.value })} />
      <div>
        <label htmlFor={`blog-content-${submitLabel}`} className="mb-1 block text-sm text-text-secondary">Content</label>
        <textarea
          id={`blog-content-${submitLabel}`}
          className="focus-ring-gold min-h-[200px] w-full resize-y rounded-lg border border-border-subtle bg-bg-surface px-4 py-2.5 text-sm text-text-primary"
          value={form.content}
          onChange={(e) => setForm({ content: e.target.value })}
        />
      </div>
      <Input label="Excerpt" value={form.excerpt} onChange={(e) => setForm({ excerpt: e.target.value })} />
      <label className="flex items-center gap-2 text-sm text-text-primary">
        <input type="checkbox" checked={form.publish} onChange={(e) => setForm({ publish: e.target.checked })} className="rounded border-border-subtle" />
        {submitLabel === "Create" ? "Publish immediately" : "Published"}
      </label>
      <div className="flex gap-2">
        <Button type="submit">{submitLabel}</Button>
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}

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

  function autoSlug(val: string) {
    setTitle(val);
    if (!editPost) setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
  }

  const formState = { title, slug, content, excerpt, publish };
  const patchForm = (patch: Partial<PostFormState>) => {
    if (patch.title !== undefined) { autoSlug(patch.title); return; }
    if (patch.slug !== undefined) setSlug(patch.slug);
    if (patch.content !== undefined) setContent(patch.content);
    if (patch.excerpt !== undefined) setExcerpt(patch.excerpt);
    if (patch.publish !== undefined) setPublish(patch.publish);
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-10">
      <PageHeader
        eyebrow="Account"
        title="Blog"
        subtitle="Manage your blog posts."
        action={<Button onClick={() => { resetForm(); setShowNew(true); }}>New Post</Button>}
      />

      <Dialog open={showNew} onOpenChange={(o) => setShowNew(o)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>New Post</DialogTitle>
          </DialogHeader>
          <PostFormFields
            form={formState}
            setForm={patchForm}
            onTitleChange={autoSlug}
            submitLabel="Create"
            onSubmit={createPost}
            onCancel={() => setShowNew(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editPost} onOpenChange={(o) => { if (!o) setEditPost(null); }}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Post</DialogTitle>
          </DialogHeader>
          <PostFormFields
            form={formState}
            setForm={patchForm}
            onTitleChange={(val) => setTitle(val)}
            submitLabel="Save"
            onSubmit={updatePost}
            onCancel={() => setEditPost(null)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteId} onOpenChange={(o) => { if (!o) setDeleteId(null); }}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Post</DialogTitle>
          </DialogHeader>
          <p className="mb-4 text-text-secondary">Are you sure you want to delete this post? This cannot be undone.</p>
          <div className="flex gap-2">
            <Button variant="danger" onClick={deletePost}>Delete</Button>
            <Button variant="ghost" onClick={() => setDeleteId(null)}>Cancel</Button>
          </div>
        </DialogContent>
      </Dialog>

      {loading ? (
        <div className="card-lux p-6 hover:translate-y-0" aria-hidden="true">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton mb-2 h-12 rounded-lg last:mb-0" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <EmptyState
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
            </svg>
          }
          title="No posts yet"
          hint="Share your first story with the world."
          cta={<Button size="sm" onClick={() => { resetForm(); setShowNew(true); }}>Write a post</Button>}
        />
      ) : (
        <div className="card-lux overflow-hidden hover:translate-y-0">
          <div className="overflow-x-auto">
            <table className="table-lux w-full text-sm">
              <thead>
                <tr>
                  <th scope="col" className="px-6 pb-3 pt-5 text-start font-medium">Title</th>
                  <th scope="col" className="px-6 pb-3 pt-5 text-start font-medium">Status</th>
                  <th scope="col" className="px-6 pb-3 pt-5 text-start font-medium">Created</th>
                  <th scope="col" className="px-6 pb-3 pt-5 text-end font-medium"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                {posts.map((p) => (
                  <tr key={p.id}>
                    <td className="max-w-xs truncate px-6 pe-4 font-medium text-text-primary">{p.title}</td>
                    <td className="px-6">
                      <Badge variant={p.publishedAt ? "success" : "info"} size="sm">{p.publishedAt ? "Published" : "Draft"}</Badge>
                    </td>
                    <td className="whitespace-nowrap px-6 text-text-secondary">{dateFormatter.format(new Date(p.createdAt))}</td>
                    <td className="px-6 text-end">
                      <div className="inline-flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => openEdit(p)}>Edit</Button>
                        <Button variant="danger" size="sm" onClick={() => setDeleteId(p.id)}>Delete</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
