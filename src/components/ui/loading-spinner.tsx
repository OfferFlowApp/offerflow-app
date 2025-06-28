
"use client";

import { cn } from "@/lib/utils";
import * as React from "react";

const LoadingSpinner = React.forwardRef<
  SVGSVGElement,
  React.SVGProps<SVGSVGElement>
>(({ className, ...props }, ref) => {
  const id = React.useId();
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("animate-spin", className)}
      ref={ref}
      {...props}
    >
      <defs>
        <linearGradient id={id} x1="100%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="hsl(var(--accent))" />
          <stop offset="100%" stopColor="hsl(var(--primary))" />
        </linearGradient>
      </defs>
      <path
        d="M21 12a9 9 0 1 1-6.219-8.56"
        stroke={`url(#${id})`}
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
});
LoadingSpinner.displayName = "LoadingSpinner";

export { LoadingSpinner };
