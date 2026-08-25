"use client";

import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button, Spinner } from "@/components/ui";
import { useConversations, useConversation } from "@/hooks/use-chat";

interface Contact {
  name?: string;
  phone: string;
}

interface Conversation {
  id: string;
  messages?: { role: string; content: string; createdAt?: string }[];
  status: string;
  createdAt: string;
  contact?: Contact | null;
}

export default function ChatPage() {
  const queryClient = useQueryClient();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [optimisticMsg, setOptimisticMsg] = useState<{ role: string; content: string; createdAt: string } | null>(null);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const conversationsQuery = useConversations();
  const conversations: Conversation[] = conversationsQuery.data?.conversations ?? [];
  const loadingList = conversationsQuery.isLoading;

  // ponytail: optimistic user bubble kept local; server thread lives in the query cache
  const threadQuery = useConversation(activeId);
  const baseMessages: { role: string; content: string; createdAt?: string }[] = useMemo(
    () => (activeId ? threadQuery.data?.conversation?.messages : null) ?? [],
    [activeId, threadQuery.data]
  );
  const messages = useMemo(
    () => (optimisticMsg ? [...baseMessages, optimisticMsg] : baseMessages),
    [baseMessages, optimisticMsg]
  );

  const scrollDown = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => { scrollDown(); }, [messages, scrollDown]);

  const openConversation = (id: string) => {
    setActiveId(id);
    setOptimisticMsg(null);
  };

  const newConversation = () => {
    setActiveId(null);
    setOptimisticMsg(null);
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || sending) return;
    setInput("");

    setOptimisticMsg({ role: "user", content: text, createdAt: new Date().toISOString() });
    setSending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId: activeId, message: text }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error);

      setActiveId(d.conversation?.id || null);
      queryClient.setQueryData(["conversation", d.conversation.id], { conversation: d.conversation });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    } catch {
      // rollback optimistic bubble on failure
    } finally {
      setOptimisticMsg(null);
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const formatTime = (dateStr: string) =>
    new Date(dateStr).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    if (diff < 86400000) return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-3.5rem)] max-w-6xl md:h-screen">
      <aside className="flex w-72 shrink-0 flex-col border-e border-border-subtle bg-bg-surface/50">
        <div className="border-b border-border-subtle p-4">
          <Button size="sm" fullWidth onClick={newConversation} leftIcon={
            <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14m7-7H5" /></svg>
          }>
            New Conversation
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {loadingList ? (
            <div className="space-y-2 p-4" aria-hidden="true">
              {[1, 2, 3].map((i) => <div key={i} className="skeleton h-14 rounded-lg" />)}
            </div>
          ) : conversations.length === 0 ? (
            <div className="p-6 text-center">
              <svg className="mx-auto mb-2 size-8 text-text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
              </svg>
              <p className="text-sm font-medium text-text-secondary">No conversations yet</p>
              <p className="mt-1 text-xs text-text-muted">Start one — the assistant is listening.</p>
            </div>
          ) : (
            conversations.map((c) => (
              <button
                key={c.id}
                onClick={() => openConversation(c.id)}
                className={`focus-ring-gold w-full border-s-2 px-4 py-3 text-start transition-colors hover:bg-bg-elevated ${
                  activeId === c.id ? "border-s-accent-gold bg-bg-elevated" : "border-s-transparent"
                }`}
              >
                <p className="truncate text-sm font-medium text-text-primary">
                  {c.contact?.name || c.contact?.phone || "New Chat"}
                </p>
                <p className="mt-0.5 text-xs text-text-muted">{formatDate(c.createdAt)}</p>
                {c.messages && c.messages.length > 0 && (
                  <p className="mt-1 truncate text-xs text-text-secondary">
                    {c.messages[c.messages.length - 1]?.content?.slice(0, 60)}
                  </p>
                )}
              </button>
            ))
          )}
        </div>
      </aside>

      <section className="flex flex-1 flex-col">
        {messages.length === 0 && !activeId && (
          <div className="flex flex-1 items-center justify-center p-8 text-center">
            <div>
              <svg className="mx-auto mb-4 size-16 text-accent-gold/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
              </svg>
              <h2 className="mb-1 text-lg font-semibold text-text-primary">Wujood AI Assistant</h2>
              <p className="text-sm text-text-secondary">Ask me anything about your business presence.</p>
            </div>
          </div>
        )}

        {messages.length > 0 && (
          <div className="animate-stagger flex-1 space-y-4 overflow-y-auto p-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed backdrop-blur-sm ${
                    msg.role === "user"
                      ? "rounded-ee-md border border-accent-gold/25 bg-accent-gold/15 text-white"
                      : "glass-panel rounded-es-md text-text-primary"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
                {"createdAt" in msg && msg.createdAt && (
                  <span className="mt-1 px-1 text-xs text-text-muted">{formatTime(msg.createdAt)}</span>
                )}
              </div>
            ))}
            {sending && (
              <div className="flex items-start">
                <div className="glass-panel rounded-es-md rounded-2xl px-4 py-3">
                  <Spinner size="sm" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}

        <div className="sticky bottom-0 border-t border-border-subtle bg-bg-primary/90 p-4 backdrop-blur-md">
          <div className="flex gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={activeId || messages.length > 0 ? "Type a message..." : "Start a new conversation..."}
              className="focus-ring-gold flex-1 rounded-xl border border-border-subtle bg-bg-surface px-4 py-3 text-sm text-text-primary transition-colors placeholder:text-text-muted"
              disabled={sending}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || sending}
              className="focus-ring-gold flex size-12 shrink-0 items-center justify-center rounded-xl bg-accent-gold text-black transition-all duration-150 hover:brightness-110 active:brightness-90 disabled:opacity-40"
              aria-label="Send message"
            >
              {sending ? (
                <Spinner size="sm" className="text-black" />
              ) : (
                <svg className="size-5 rtl:-scale-x-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              )}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
