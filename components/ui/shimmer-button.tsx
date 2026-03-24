"use client";
import React from "react";
import { cn } from "@/lib/utils";

interface ShimmerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children?: React.ReactNode;
}

export default function ShimmerButton({
  children,
  className,
  disabled,
  ...props
}: ShimmerButtonProps) {
  return (
    <button
      disabled={disabled}
      className={cn(
        "relative w-full overflow-hidden rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-all",
        disabled ? "cursor-not-allowed opacity-50" : "",
        className
      )}
      {...props}
    >
      {!disabled && (
        <span
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%)",
            animation: "shimmer-slide 1.8s infinite",
          }}
        />
      )}
      <span className="relative">{children}</span>
    </button>
  );
}
