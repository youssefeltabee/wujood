"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Accounts
export function useSocialAccounts() {
  return useQuery({
    queryKey: ["social-accounts"],
    queryFn: async () => {
      const res = await fetch("/api/social");
      if (!res.ok) throw new Error("Failed to fetch social accounts");
      return res.json();
    },
  });
}

export function useConnectSocialAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { platform: string; handle?: string; token?: string }) => {
      const res = await fetch("/api/social", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to connect account");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["social-accounts"] });
    },
  });
}

export function useDisconnectSocialAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/social/accounts/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to disconnect account");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["social-accounts"] });
    },
  });
}

// Posts
export function useSocialPosts(filters?: { status?: string; accountId?: string }) {
  return useQuery({
    queryKey: ["social-posts", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.status) params.set("status", filters.status);
      if (filters?.accountId) params.set("accountId", filters.accountId);
      const qs = params.toString();
      const res = await fetch(`/api/social/posts${qs ? `?${qs}` : ""}`);
      if (!res.ok) throw new Error("Failed to fetch posts");
      return res.json();
    },
  });
}

export function useCreateSocialPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { accountId: string; content: string; mediaUrls?: string[]; scheduledAt?: string }) => {
      const res = await fetch("/api/social/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create post");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["social-posts"] });
    },
  });
}

export function useDeleteSocialPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/social/posts/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete post");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["social-posts"] });
    },
  });
}

export function usePostAnalytics(id: string | null) {
  return useQuery({
    queryKey: ["post-analytics", id],
    queryFn: async () => {
      const res = await fetch(`/api/social/posts/${id}/analytics`);
      if (!res.ok) throw new Error("Failed to fetch analytics");
      return res.json();
    },
    enabled: !!id,
  });
}
