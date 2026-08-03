"use client"

import * as React from "react"
import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip"
import { cn } from "@/lib/utils"

function ShadcnTooltipProvider({
  ...props
}: TooltipPrimitive.Provider.Props) {
  return <TooltipPrimitive.Provider {...props} />
}

function ShadcnTooltip({
  ...props
}: TooltipPrimitive.Root.Props) {
  return <TooltipPrimitive.Root {...props} />
}

function ShadcnTooltipTrigger({
  ...props
}: TooltipPrimitive.Trigger.Props) {
  return <TooltipPrimitive.Trigger {...props} />
}

function ShadcnTooltipContent({
  className,
  ...props
}: TooltipPrimitive.Popup.Props) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Popup
        data-slot="tooltip-content"
        className={cn(
          "z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95",
          className
        )}
        {...props}
      />
    </TooltipPrimitive.Portal>
  )
}

export { ShadcnTooltip, ShadcnTooltipTrigger, ShadcnTooltipContent, ShadcnTooltipProvider }
