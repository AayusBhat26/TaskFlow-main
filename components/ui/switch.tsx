"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  className?: string
  label?: string
  onCheckedChange?: (checked: boolean) => void
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, label, onCheckedChange, checked, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onCheckedChange) {
        onCheckedChange(e.target.checked)
      }
    }

    return (
      <div className="flex items-center space-x-2">
        <label className="relative inline-flex cursor-pointer items-center">
          <input
            type="checkbox"
            className="peer sr-only"
            ref={ref}
            onChange={handleChange}
            checked={checked}
            {...props}
          />
          <div
            className={cn(
              "relative h-6 w-11 rounded-full transition-colors duration-200 ease-in-out",
              "bg-gray-200 dark:bg-gray-700",
              "peer-checked:bg-blue-600 peer-checked:dark:bg-blue-500",
              "peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 peer-focus:ring-offset-2",
              "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
              className
            )}
          >
            <div
              className={cn(
                "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-all duration-200 ease-in-out",
                checked ? "left-6" : "left-0.5"
              )}
            />
          </div>
        </label>
        {label && (
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {label}
          </span>
        )}
      </div>
    )
  }
)

Switch.displayName = "Switch"

export { Switch } ; 