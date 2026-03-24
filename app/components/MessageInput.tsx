"use client";
import { cn } from "@/lib/utils";

interface MessageInputProps {
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
}

export default function MessageInput({ value, onChange, disabled }: MessageInputProps) {
  return (
    <textarea
      className={cn(
        "w-full rounded-lg bg-card border border-border p-4 text-foreground resize-none min-h-[120px]",
        "focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring",
        disabled && "opacity-50 cursor-not-allowed"
      )}
      placeholder="Enter your message..."
      value={value ?? ""}
      onChange={(e) => onChange?.(e.target.value)}
      disabled={disabled}
    />
  );
}
