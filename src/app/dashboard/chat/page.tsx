"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Card, Button, Input, Spinner } from "@/components/ui";

interface Contact {
  name?: string;
  phone: string;
}

interface Conversation {
  id: string;
  messages?: { role: string; content: string }[];
  status: string;
  createdAt: string;
  contact?: Contact | null;
}

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loadingList, setLoadingList] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollDown = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => { scrollDown(); }, [messages, scrollDown]);

  useEffect(() => {
    fetch("/api/chat")
      .then(async (r) => {
        if (!r.ok) { if (r.status === 401) window.location.href = "/login"; return; }
        return r.json();
      })
      .then((d) => { if (d) setConversations(d.conversations || []); setLoadingList(false); })
      .catch(() => setLoadingList(false));
  }, []);

  const openConversation = async (id: string) => {
    setActiveId(id);
    try {
      const res = await fetch(`/api/chat/${id}`);
      const d = await res.json();
      setMessages(d.conversation?.messages || []);
    } catch {
      setMessages([]);
    }
  };

  const newConversation = () => {
    setActiveId(null);
    setMessages([]);
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || sending) return;
    setInput("");

    const optimistic: { role: string; content: string }[] = [...messages, { role: "user", content: text }];
    setMessages(optimistic);
    setSending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId: activeId, message: text }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error);

      setMessages(d.conversation?.messages || []);
      setActiveId(d.conversation?.id || null);

      setConversations((prev) => {
        const updated = d.conversation;
        const exists = prev.find((c) => c.id === updated.id);
        if (exists) return prev.map((c) => (c.id === updated.id ? updated : c));
        return [updated, ...prev];
      });
    } catch {
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    if (diff < 86400000) return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem)] max-w-6xl mx-auto">
      <aside className="w-72 shrink-0 border-r border-border-subtle flex flex-col bg-bg-surface/50">
        <div className="p-4 border-b border-border-subtle">
          <Button size="sm" fullWidth onClick={newConversation} leftIcon={
            <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14m7-7H5" /></svg>
          }>
            New Conversation
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {loadingList ? (
            <div className="flex justify-center py-8"><Spinner size="sm" /></div>
          ) : conversations.length === 0 ? (
            <p className="text-text-muted text-sm text-center py-8">No conversations yet</p>
          ) : (
            conversations.map((c) => (
              <button
                key={c.id}
                onClick={() => openConversation(c.id)}
                className={`w-full text-left px-4 py-3 border-b border-border-subtle transition-colors hover:bg-bg-elevated ${
                  activeId === c.id ? "bg-bg-elevated border-l-2 border-l-accent-gold" : ""
                }`}
              >
                <p className="text-sm font-medium text-text-primary truncate">
                  {c.contact?.name || c.contact?.phone || "New Chat"}
                </p>
                <p className="text-xs text-text-muted mt-0.5">{formatDate(c.createdAt)}</p>
                {c.messages && c.messages.length > 0 && (
                  <p className="text-xs text-text-secondary truncate mt-1">
                    {c.messages[c.messages.length - 1]?.content?.slice(0, 60)}
                  </p>
                )}
              </button>
            ))
          )}
        </div>
      </aside>

      <section className="flex-1 flex flex-col">
        {messages.length === 0 && !activeId && (
          <div className="flex-1 flex items-center justify-center text-center p-8">
            <div>
              <svg className="size-16 mx-auto text-accent-gold/30 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
              </svg>
              <h2 className="text-lg font-semibold text-text-primary mb-1">Wujood AI Assistant</h2>
              <p className="text-sm text-text-secondary">Ask me anything about your business presence.</p>
            </div>
          </div>
        )}

        {messages.length > 0 && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-accent-gold text-black rounded-br-md"
                      : "bg-bg-elevated text-text-primary rounded-bl-md border border-border-subtle"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            {sending && (
              <div className="flex justify-start">
                <div className="bg-bg-elevated rounded-2xl rounded-bl-md px-4 py-3 border border-border-subtle">
                  <Spinner size="sm" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}

        <div className="border-t border-border-subtle p-4">
          <div className="flex gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={activeId || messages.length > 0 ? "Type a message..." : "Start a new conversation..."}
              className="flex-1 rounded-xl border border-border-subtle bg-bg-surface px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold/20 focus-visible:border-accent-gold transition-colors"
              disabled={sending}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || sending}
              className="shrink-0 size-12 rounded-xl bg-accent-gold text-black flex items-center justify-center hover:brightness-110 disabled:opacity-40 transition-all duration-150"
              aria-label="Send message"
            >
              {sending ? (
                <svg className="size-5 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
              ) : (
                <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              )}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
