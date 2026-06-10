"use client";

import * as React from "react";
import { cn } from "../../_lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | "destructive";
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variants = {
      default: "border-transparent bg-gray-900 text-gray-50 hover:bg-gray-900/80",
      secondary: "border-transparent bg-gray-100 text-gray-900 hover:bg-gray-100/80",
      outline: "text-gray-950",
      destructive: "border-transparent bg-red-500 text-gray-50 hover:bg-red-500/80",
    };
    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);
Badge.displayName = "Badge";

export { Badge };