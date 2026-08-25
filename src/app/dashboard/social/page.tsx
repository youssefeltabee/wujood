"use client";

import { useState } from "react";
import { Badge, Button, Input, Select, useToast } from "@/components/ui";
import {
  useSocialAccounts,
  useConnectSocialAccount,
  useDisconnectSocialAccount,
  useSocialPosts,
  useCreateSocialPost,
  useDeleteSocialPost,
} from "@/hooks/use-social";
import { EmptyState, PageHeader } from "../_components/chrome";

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
  POSTED: "success",
  SCHEDULED: "warning",
  DRAFT: "info",
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
  const [platform, setPlatform] = useState("");
  const [handle, setHandle] = useState("");
  const [content, setContent] = useState("");
  const [selectedAccount, setSelectedAccount] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const accountsQuery = useSocialAccounts();
  const postsQuery = useSocialPosts(statusFilter ? { status: statusFilter } : undefined);
  const connectAccount = useConnectSocialAccount();
  const disconnectAccount = useDisconnectSocialAccount();
  const createPostMutation = useCreateSocialPost();
  const deletePostMutation = useDeleteSocialPost();

  const accounts: SocialAccount[] = accountsQuery.data?.accounts ?? [];
  const posts: SocialPost[] = postsQuery.data?.posts ?? [];
  const loading = accountsQuery.isLoading || postsQuery.isLoading;

  function addAccount() {
    if (!platform) return;
    connectAccount.mutate({ platform, handle }, {
      onSuccess: () => {
        toast("Account added", "success");
        setPlatform("");
        setHandle("");
      },
      onError: (err: Error) => toast(err.message || "Failed to add account", "error"),
    });
  }

  function removeAccount(id: string) {
    disconnectAccount.mutate(id, {
      onSuccess: () => toast("Account removed", "success"),
    });
  }

  function createPost() {
    if (!selectedAccount || !content) return;
    createPostMutation.mutate({
      accountId: selectedAccount,
      content,
      scheduledAt: scheduledAt || undefined,
    }, {
      onSuccess: () => {
        toast("Post created", "success");
        setContent("");
        setScheduledAt("");
      },
      onError: (err: Error) => toast(err.message || "Failed to create post", "error"),
    });
  }

  function deletePost(id: string) {
    deletePostMutation.mutate(id, {
      onSuccess: () => toast("Post deleted", "success"),
    });
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-lg px-6 py-10">
      <PageHeader
        eyebrow="Tools"
        title="Social Commander"
        subtitle="Manage connected accounts and scheduled posts."
      />

      <section aria-label="Connected accounts">
        <div className="card-lux p-6 hover:translate-y-0">
          <p className="section-label mb-2">Channels</p>
          <h2 className="mb-5 text-lg font-semibold text-text-primary">Connected Accounts</h2>
          {accountsQuery.isLoading ? (
            <div className="space-y-2" aria-hidden="true">
              {[1, 2].map((i) => <div key={i} className="skeleton h-11 rounded-lg" />)}
            </div>
          ) : accounts.length === 0 ? (
            <EmptyState
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                </svg>
              }
              title="No accounts connected"
              hint="Link a platform below to start broadcasting."
            />
          ) : (
            <ul className="mb-4 space-y-2">
              {accounts.map((a) => (
                <li key={a.id} className="flex items-center justify-between rounded-lg bg-bg-elevated px-3 py-2">
                  <div className="flex items-center gap-3">
                    <Badge variant="gold" size="sm">{a.platform}</Badge>
                    <span className="text-sm text-text-primary">{a.handle || "—"}</span>
                  </div>
                  <Button variant="danger" size="sm" onClick={() => removeAccount(a.id)}>Remove</Button>
                </li>
              ))}
            </ul>
          )}

          <form
            onSubmit={(e) => { e.preventDefault(); addAccount(); }}
            className="flex flex-col items-stretch gap-3 border-t border-border-subtle pt-3 sm:flex-row sm:items-end"
          >
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
            <Button type="submit" disabled={!platform}>Connect</Button>
          </form>
        </div>
      </section>

      <section id="create-post" aria-label="Create post" className="scroll-mt-20">
        <div className="card-lux p-6 hover:translate-y-0">
          <p className="section-label mb-2">Compose</p>
          <h2 className="mb-5 text-lg font-semibold text-text-primary">Create Post</h2>
          <form
            onSubmit={(e) => { e.preventDefault(); createPost(); }}
            className="flex flex-col gap-lg"
          >
            <Select
              options={accounts.map((a) => ({ value: a.id, label: `${a.platform}${a.handle ? ` (${a.handle})` : ""}` }))}
              placeholder="Select account"
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
            />
            <div>
              <label htmlFor="social-content" className="mb-1 block text-sm text-text-secondary">Content</label>
              <textarea
                id="social-content"
                className="focus-ring-gold min-h-[100px] w-full resize-y rounded-lg border border-border-subtle bg-bg-surface px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted"
                placeholder="Write your post content..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
            <Input
              type="datetime-local"
              label="Schedule (optional)"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
            />
            <div>
              <Button type="submit" disabled={!selectedAccount || !content}>
                {scheduledAt ? "Schedule Post" : "Save Draft"}
              </Button>
            </div>
          </form>
        </div>
      </section>

      <section aria-label="Posts">
        <div className="card-lux p-6 hover:translate-y-0">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="section-label mb-2">Broadcasts</p>
              <h2 className="text-lg font-semibold text-text-primary">Posts</h2>
            </div>
            <Select
              options={[
                { value: "", label: "All" },
                { value: "DRAFT", label: "Drafts" },
                { value: "SCHEDULED", label: "Scheduled" },
                { value: "POSTED", label: "Posted" },
              ]}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-40"
            />
          </div>
          {loading ? (
            <div className="space-y-2" aria-hidden="true">
              {[1, 2, 3].map((i) => <div key={i} className="skeleton h-16 rounded-xl" />)}
            </div>
          ) : posts.length === 0 ? (
            <EmptyState
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
              }
              title="No posts yet"
              hint="Draft or schedule your first broadcast above."
              cta={<a href="#create-post" className="focus-ring-gold rounded text-sm font-medium text-accent-gold hover:underline">Compose a post</a>}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="table-lux w-full text-sm">
                <thead>
                  <tr>
                    <th scope="col" className="px-6 pb-3 pt-5 text-start font-medium">Post</th>
                    <th scope="col" className="px-6 pb-3 pt-5 text-start font-medium">Channel</th>
                    <th scope="col" className="px-6 pb-3 pt-5 text-start font-medium">Status</th>
                    <th scope="col" className="px-6 pb-3 pt-5 text-start font-medium">Timing</th>
                    <th scope="col" className="px-6 pb-3 pt-5 text-end font-medium"><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((p) => (
                    <tr key={p.id}>
                      <td className="max-w-xs px-6 pe-4">
                        <p className="line-clamp-2 whitespace-pre-wrap text-text-primary">{p.content}</p>
                        {p.analytics && p.status === "POSTED" && (
                          <p className="mt-1 text-xs text-accent-cyan">
                            {p.analytics.likes} likes · {p.analytics.shares} shares · {p.analytics.reach} reach
                          </p>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6">
                        <Badge variant="gold" size="sm">{p.account.platform}</Badge>
                      </td>
                      <td className="px-6">
                        <Badge variant={statusVariant[p.status] || "default"} size="sm">{p.status}</Badge>
                      </td>
                      <td className="whitespace-nowrap px-6 text-xs text-text-secondary">
                        {p.postedAt ? <>Posted {new Date(p.postedAt).toLocaleString()}</> :
                         p.scheduledAt ? <>Sched. {new Date(p.scheduledAt).toLocaleString()}</> :
                         "—"}
                      </td>
                      <td className="px-6 text-end">
                        <Button variant="danger" size="sm" onClick={() => deletePost(p.id)}>Delete</Button>
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
