"use client";

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
}

function Tabs({ variant = "underline", activeTab, onTabChange, tabs, className }: TabsProps) {
  const style = variants[variant];

  return (
    <div className={cn("flex", style.list, className)} role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          role="tab"
          aria-selected={activeTab === tab.value}
          onClick={() => onTabChange(tab.value)}
          className={cn(style.tab, activeTab === tab.value && style.active, "flex items-center gap-2")}
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
  if (value !== activeTab) return null;
  return (
    <div role="tabpanel" className={cn("pt-4", className)}>
      {children}
    </div>
  );
}

Tabs.Panel = TabPanel;
Tabs.displayName = "Tabs";
TabPanel.displayName = "TabPanel";

export { Tabs, TabPanel };
export type { TabsProps, TabPanelProps };
