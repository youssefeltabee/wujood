"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const variants = {
  underline: {
    list: "border-b border-border-subtle gap-0",
    tab: "px-4 py-3 text-sm font-medium text-text-muted border-b-2 border-transparent -mb-[1px] transition-all duration-150 hover:text-text-primary",
    active: "text-accent-gold border-accent-gold",
  },
  pill: {
    list: "gap-1 p-1 bg-bg-surface rounded-xl",
    tab: "px-4 py-2 text-sm font-medium text-text-muted rounded-lg transition-all duration-150 hover:text-text-primary",
    active: "bg-bg-elevated text-text-primary shadow-sm",
  },
};

interface TabsProps {
  variant?: keyof typeof variants;
  activeTab: string;
  onTabChange: (value: string) => void;
  tabs: { value: string; label: string; badge?: React.ReactNode }[];
  className?: string;
  syncHash?: boolean;
}

function Tabs({ variant = "underline", activeTab, onTabChange, tabs, className }: TabsProps) {
  const style = variants[variant];
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const idx = tabs.findIndex((t) => t.value === activeTab);
      let next: number | null = null;
      switch (e.key) {
        case "ArrowRight":
          next = (idx + 1) % tabs.length;
          break;
        case "ArrowLeft":
          next = (idx - 1 + tabs.length) % tabs.length;
          break;
        case "Home":
          next = 0;
          break;
        case "End":
          next = tabs.length - 1;
          break;
      }
      if (next !== null) {
        e.preventDefault();
        onTabChange(tabs[next].value);
        tabRefs.current[next]?.focus();
      }
    },
    [activeTab, tabs, onTabChange]
  );

  return (
    <div className={cn("flex overflow-x-auto scrollbar-none", style.list, className)} role="tablist" onKeyDown={handleKeyDown}>
      {tabs.map((tab, i) => (
        <button
          key={tab.value}
          ref={(el) => { tabRefs.current[i] = el; }}
          role="tab"
          aria-selected={activeTab === tab.value}
          tabIndex={activeTab === tab.value ? 0 : -1}
          onClick={() => onTabChange(tab.value)}
          className={cn(style.tab, activeTab === tab.value && style.active, "flex items-center gap-2 whitespace-nowrap")}
        >
          {tab.label}
          {tab.badge}
        </button>
      ))}
    </div>
  );
}

interface TabPanelProps {
  value: string;
  activeTab: string;
  children: React.ReactNode;
  className?: string;
}

function TabPanel({ value, activeTab, children, className }: TabPanelProps) {
  const [visible, setVisible] = useState(value === activeTab);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ponytail: re-arm during render (react.dev "adjust state when props change"); effect below handles the delayed hide
  if (value === activeTab && !visible) setVisible(true);

  useEffect(() => {
    if (value === activeTab) return;
    timerRef.current = setTimeout(() => setVisible(false), 150);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [value, activeTab]);

  if (!visible && value !== activeTab) return null;

  return (
    <div
      role="tabpanel"
      className={cn("pt-4 transition-opacity duration-150", value === activeTab ? "opacity-100" : "opacity-0 absolute pointer-events-none", className)}
    >
      {children}
    </div>
  );
}

function TabbedLayout({
  tabs,
  defaultTab,
  children,
  variant = "underline",
  className,
}: {
  tabs: { value: string; label: string }[];
  defaultTab: string;
  children: (activeTab: string) => React.ReactNode;
  variant?: keyof typeof variants;
  className?: string;
}) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  useEffect(() => {
    const onHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash && tabs.some((t) => t.value === hash)) setActiveTab(hash);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [tabs]);

  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value);
    window.location.hash = value;
  }, []);

  return (
    <div className={className}>
      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} variant={variant} syncHash />
      {children(activeTab)}
    </div>
  );
}

Tabs.Panel = TabPanel;
Tabs.displayName = "Tabs";
TabPanel.displayName = "TabPanel";

export { Tabs, TabPanel, TabbedLayout };
export type { TabsProps, TabPanelProps };
