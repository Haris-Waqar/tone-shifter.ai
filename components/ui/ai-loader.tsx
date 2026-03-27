"use client";

import { cn } from "@/lib/utils";

export interface AiLoaderProps {
  size?: number;
  /** Label shown as animated letter ring (default matches app loading copy). */
  text?: string;
  className?: string;
}

/**
 * AI loader from 21st.dev community (theutkarshmail / ai-loader).
 * https://21st.dev/community/components/theutkarshmail/ai-loader/default
 */
export function AiLoader({ size = 180, text = "Shifting", className }: AiLoaderProps) {
  const letters = text.split("");

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={cn(
        "flex h-full min-h-0 w-full items-center justify-center",
        className
      )}
    >
      <span className="sr-only">Loading tone suggestions</span>
      <div
        className="relative flex items-center justify-center select-none font-sans"
        style={{ width: size, height: size }}
      >
        <div
          className="ai-loader-circle pointer-events-none absolute inset-0 z-0 rounded-full"
          aria-hidden
        />
        {letters.map((letter, index) => (
          <span
            key={`${index}-${letter}`}
            className="ai-loader-letter text-primary relative z-10 inline-block"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {letter === " " ? "\u00a0" : letter}
          </span>
        ))}
      </div>
    </div>
  );
}

export default AiLoader;
