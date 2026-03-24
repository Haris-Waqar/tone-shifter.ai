"use client";
import { cn } from "@/lib/utils";

const MAX_LENGTH = 2000;

interface MessageInputProps {
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  maxLength?: number;
}

export default function MessageInput({
  value = "",
  onChange,
  disabled,
  maxLength = MAX_LENGTH,
}: MessageInputProps) {
  const count = value.length;
  const nearLimit = count >= maxLength * 0.85;

  return (
    <div className="space-y-1">
      <textarea
        className={cn(
          "w-full rounded-lg bg-card border border-border p-4 text-foreground resize-none min-h-[120px]",
          "focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring transition-colors",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        placeholder="Enter your message…"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        maxLength={maxLength}
      />
      <div className="flex justify-between items-center px-1">
        <span className="text-xs text-muted-foreground hidden sm:block">
          ⌘↵ to submit
        </span>
        <span
          className={cn(
            "text-xs ml-auto",
            nearLimit ? "text-destructive" : "text-muted-foreground"
          )}
        >
          {count}/{maxLength}
        </span>
      </div>
    </div>
  );
}
