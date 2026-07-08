"use client";

import { cn } from "@/lib/utils";

type TooltipPosition = "top" | "bottom" | "left" | "right";

const positionStyles: Record<TooltipPosition, string> = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  left: "right-full top-1/2 -translate-y-1/2 mr-2",
  right: "left-full top-1/2 -translate-y-1/2 ml-2",
};

const arrowStyles: Record<TooltipPosition, string> = {
  top: "top-full left-1/2 -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-bg-elevated",
  bottom: "bottom-full left-1/2 -translate-x-1/2 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-bg-elevated",
  left: "left-full top-1/2 -translate-y-1/2 border-t-4 border-b-4 border-l-4 border-t-transparent border-b-transparent border-l-bg-elevated",
  right: "right-full top-1/2 -translate-y-1/2 border-t-4 border-b-4 border-r-4 border-t-transparent border-b-transparent border-r-bg-elevated",
};

interface TooltipProps {
  content: string;
  position?: TooltipPosition;
  delay?: number;
  className?: string;
  children: React.ReactNode;
}

function Tooltip({ content, position = "top", delay = 200, className, children }: TooltipProps) {
  return (
    <div className={cn("group relative inline-flex", className)}>
      {children}
      <div
        className={cn(
          "pointer-events-none absolute z-50 opacity-0 transition-opacity",
          "group-hover:opacity-100",
          positionStyles[position]
        )}
        style={{ transitionDelay: `${delay}ms` }}
        role="tooltip"
      >
        <div className="relative whitespace-nowrap rounded-lg bg-bg-elevated px-3 py-1.5 text-xs text-text-primary shadow-lg border border-border-subtle">
          {content}
          <span className={cn("absolute size-0", arrowStyles[position])} />
        </div>
      </div>
    </div>
  );
}
Tooltip.displayName = "Tooltip";

export { Tooltip };
export type { TooltipProps, TooltipPosition };
