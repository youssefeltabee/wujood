"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useAudits(page = 1, pageSize = 20) {
  return useQuery({
    queryKey: ["audits", page, pageSize],
    queryFn: async () => {
      const res = await fetch(`/api/audit?page=${page}&pageSize=${pageSize}`);
      if (!res.ok) throw new Error("Failed to fetch audits");
      return res.json();
    },
  });
}

export function useAudit(id: string | null) {
  return useQuery({
    queryKey: ["audit", id],
    queryFn: async () => {
      const res = await fetch(`/api/audit/${id}`);
      if (!res.ok) throw new Error("Failed to fetch audit");
      return res.json();
    },
    enabled: !!id,
  });
}

export function useAuditStatus(id: string | null) {
  return useQuery({
    queryKey: ["audit-status", id],
    queryFn: async () => {
      const res = await fetch(`/api/audit/${id}/status`);
      if (!res.ok) throw new Error("Failed to fetch audit status");
      return res.json();
    },
    enabled: !!id,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === "PENDING" || status === "RUNNING" ? 2000 : false;
    },
  });
}

export function useCreateAudit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { url: string }) => {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create audit");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["audits"] });
    },
  });
}
