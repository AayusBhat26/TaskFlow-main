"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// Native ScrollArea implementation without Radix UI to prevent infinite re-renders
interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  children: React.ReactNode
}

const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative overflow-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

ScrollArea.displayName = "ScrollArea"

// ScrollBar component for compatibility (no-op since we use native scrolling)
interface ScrollBarProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  orientation?: "vertical" | "horizontal"
}

const ScrollBar = React.forwardRef<HTMLDivElement, ScrollBarProps>(
  ({ className, orientation = "vertical", ...props }, ref) => {
    // Return null since native scrolling handles scrollbars automatically
    return null
  }
)

ScrollBar.displayName = "ScrollBar"

export { ScrollArea, ScrollBar }
