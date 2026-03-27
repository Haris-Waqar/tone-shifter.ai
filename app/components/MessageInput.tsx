"use client";
import { SendHorizonal } from "lucide-react";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { useAutoResizeTextarea } from "@/lib/hooks";

const MAX_LENGTH = 2000;

interface MessageInputProps {
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  maxLength?: number;
  onSubmit?: () => void;
  loading?: boolean;
  submitDisabled?: boolean;
}

export default function MessageInput({
  value = "",
  onChange,
  disabled,
  maxLength = MAX_LENGTH,
  onSubmit,
  loading = false,
  submitDisabled = false,
}: MessageInputProps) {
  const count = value.length;
  const nearLimit = count >= maxLength * 0.85;
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 56,
    maxHeight: 220,
  });

  useEffect(() => {
    adjustHeight();
  }, [value, adjustHeight]);

  const canSend =
    !disabled && !loading && !submitDisabled && value.trim().length > 0;

  const handleSend = () => {
    if (!canSend) return;
    onSubmit?.();
  };

  return (
    <div className="w-full">
      <div className="moon-chat-input relative overflow-hidden rounded-2xl">
        <textarea
          id="tone-shifter-message"
          ref={textareaRef}
          className={cn(
            "w-full resize-none border-none bg-transparent",
            "text-base text-foreground placeholder:text-muted-foreground",
            "px-5 py-4 pb-16 pr-[4.5rem] leading-[1.45]",
            "transition-shadow outline-none focus-visible:ring-0 focus-visible:ring-offset-0",
            disabled && "cursor-not-allowed opacity-50"
          )}
          placeholder="Enter your message…"
          value={value}
          onChange={(e) => {
            onChange?.(e.target.value);
            adjustHeight();
          }}
          onKeyDown={(e) => {
            if (e.key !== "Enter") return;
            if (e.shiftKey) return;
            e.preventDefault();
            handleSend();
          }}
          disabled={disabled}
          maxLength={maxLength}
          rows={1}
          aria-label="Message to rewrite"
        />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 bg-gradient-to-t from-background/85 via-background/25 to-transparent px-4 pb-3 pt-10">
          <div className="pointer-events-auto flex min-w-0 flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-3">
            <span className="hidden text-[11px] text-muted-foreground sm:inline">
              Enter to shift · Shift+Enter for newline
            </span>
            <span
              className={cn(
                "text-[11px] tabular-nums",
                nearLimit ? "text-amber-400" : "text-muted-foreground"
              )}
            >
              {count}/{maxLength}
            </span>
          </div>
        </div>

        <div className="absolute bottom-3 right-3 z-10 flex items-center gap-2">
          <button
            type="button"
            onClick={handleSend}
            disabled={!canSend}
            aria-label={loading ? "Shifting tone" : "Shift tone"}
            title="Shift tone"
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring/60",
              canSend
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "cursor-not-allowed bg-muted text-muted-foreground"
            )}
          >
            {loading ? (
              <span
                className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
                aria-hidden
              />
            ) : (
              <SendHorizonal className="h-4 w-4" strokeWidth={2} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
