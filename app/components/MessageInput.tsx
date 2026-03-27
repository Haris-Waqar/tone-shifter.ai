"use client";
import { SendHorizonal } from "lucide-react";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { useAutoResizeTextarea, useMediaQuery } from "@/lib/hooks";
import MessageComposerGlow from "@/app/components/MessageComposerGlow";
import AudienceSelect from "@/app/components/AudienceSelect";
import PlatformSelect from "@/app/components/PlatformSelect";

const MAX_LENGTH = 2000;

interface MessageInputProps {
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  maxLength?: number;
  onSubmit?: () => void;
  loading?: boolean;
  submitDisabled?: boolean;
  audience: string | null;
  onAudienceChange: (value: string | null) => void;
  platform: string | null;
  onPlatformChange: (value: string | null) => void;
}

export default function MessageInput({
  value = "",
  onChange,
  disabled,
  maxLength = MAX_LENGTH,
  onSubmit,
  loading = false,
  submitDisabled = false,
  audience,
  onAudienceChange,
  platform,
  onPlatformChange,
}: MessageInputProps) {
  const count = value.length;
  const nearLimit = count >= maxLength * 0.85;
  const isDesktopLayout = useMediaQuery("(min-width: 768px)", true);
  const textareaMaxHeight = isDesktopLayout ? 150 : 110;
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 56,
    maxHeight: textareaMaxHeight,
  });
  useEffect(() => {
    adjustHeight();
  }, [value, textareaMaxHeight, adjustHeight]);

  useEffect(() => {
    if (disabled) return;
    const id = requestAnimationFrame(() => {
      textareaRef.current?.focus();
    });
    return () => cancelAnimationFrame(id);
  }, [disabled]);

  const canSend =
    !disabled && !loading && !submitDisabled && value.trim().length > 0;

  const handleSend = () => {
    if (!canSend) return;
    onSubmit?.();
  };

  return (
    <div className="w-full">
      <div className="group relative isolate w-full rounded-2xl p-[2px]">
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
          <MessageComposerGlow />
        </div>
        <div className="relative z-10 flex flex-col overflow-hidden rounded-2xl moon-chat-input">
        <textarea
          id="tone-shifter-message"
          ref={textareaRef}
          className={cn(
            "min-h-[56px] max-h-[180px] max-md:max-h-[128px] w-full resize-none overflow-y-auto border-none bg-transparent",
            "px-5 py-4 text-base leading-[1.45] text-foreground",
            "placeholder:text-muted-foreground",
            "outline-none transition-shadow focus-visible:ring-0 focus-visible:ring-offset-0",
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

        <div className="flex shrink-0 items-center gap-3 bg-background/40 px-4 py-2.5">
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2 sm:gap-3">
            <AudienceSelect
              value={audience}
              onValueChange={onAudienceChange}
              disabled={disabled || loading}
            />
            <PlatformSelect
              value={platform}
              onValueChange={onPlatformChange}
              disabled={disabled || loading}
            />
            <span
              className={cn(
                "ml-auto shrink-0 text-[11px] tabular-nums",
                nearLimit ? "text-amber-400" : "text-muted-foreground"
              )}
            >
              {count}/{maxLength}
            </span>
          </div>
          <button
            type="button"
            onClick={handleSend}
            onMouseDown={(e) => e.preventDefault()}
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
              <SendHorizonal className="h-4 w-4 -rotate-45" strokeWidth={2} />
            )}
          </button>
        </div>
        </div>
      </div>
    </div>
  );
}
