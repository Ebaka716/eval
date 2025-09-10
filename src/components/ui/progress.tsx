"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

type ProgressProps = React.ComponentProps<typeof ProgressPrimitive.Root> & {
  value?: number
  orientation?: "horizontal" | "vertical"
}

function Progress({ className, value = 0, orientation = "horizontal", ...props }: ProgressProps) {
  const pct = Math.max(0, Math.min(100, value))
  const transform = orientation === "vertical" ? `scaleY(${pct / 100})` : `scaleX(${pct / 100})`
  const origin = orientation === "vertical" ? "origin-top" : "origin-left"
  const rootBase = orientation === "vertical" ? "w-2" : "h-2 w-full"
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        `bg-primary/20 relative ${rootBase} overflow-hidden rounded-full`,
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn("bg-primary h-full w-full flex-1 transition-transform duration-1000 ease-in-out", origin)}
        style={{ transform }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }
