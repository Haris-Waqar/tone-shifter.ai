"use client";

import { useId, useMemo } from "react";
import { ChevronDown, Mail, MessageSquareText } from "lucide-react";
import {
  SelectRoot,
  SelectControl,
  SelectTrigger,
  SelectValueText,
  SelectIndicator,
  SelectPositioner,
  SelectContent,
  SelectList,
  SelectItem,
  SelectItemText,
  SelectItemIndicator,
  SelectClearTrigger,
  SelectHiddenSelect,
  createListCollection,
} from "@ark-ui/react/select";
import { Portal } from "@ark-ui/react/portal";
import { cn } from "@/lib/utils";
import { PLATFORM_ITEMS } from "@/lib/platform";

const PLATFORM_PLACEHOLDER = "Platform";

const collectionItems = PLATFORM_ITEMS.map(({ value, label }) => ({ value, label }));

/** Brand-adjacent stroke/fill via Tailwind (readable on dark UI). */
const PLATFORM_ICON = {
  email: "text-[#4285F4]",
  sms: "text-[#34C759]",
} as const;

function PlatformIcon({ value }: { value: string }) {
  const base = "size-3 shrink-0";
  switch (value) {
    case "email":
      return (
        <Mail className={cn(base, PLATFORM_ICON.email)} strokeWidth={2} aria-hidden />
      );
    case "slack":
      return (
        <svg className={base} viewBox="0 0 24 24" aria-hidden>
          <path
            fill="#E01E5A"
            d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52z"
          />
          <path
            fill="#36C5F0"
            d="M6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313z"
          />
          <path
            fill="#2EB67D"
            d="M8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834V5.042z"
          />
          <path
            fill="#ECB22E"
            d="M8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312z"
          />
          <path
            fill="#E01E5A"
            d="M18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834z"
          />
          <path
            fill="#36C5F0"
            d="M17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.528 2.528 0 0 1-2.52-2.521V2.522A2.528 2.528 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312z"
          />
          <path
            fill="#2EB67D"
            d="M15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.528 2.528 0 0 1-2.52-2.522v-2.522h2.52z"
          />
          <path
            fill="#ECB22E"
            d="M15.165 17.688a2.528 2.528 0 0 1-2.52-2.523 2.528 2.528 0 0 1 2.52-2.52h6.313A2.528 2.528 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"
          />
        </svg>
      );
    case "linkedin":
      return (
        <svg className={base} viewBox="0 0 24 24" aria-hidden>
          <path
            fill="#0A66C2"
            d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
          />
        </svg>
      );
    case "text-message":
      return (
        <MessageSquareText
          className={cn(base, PLATFORM_ICON.sms)}
          strokeWidth={2}
          aria-hidden
        />
      );
    default:
      return null;
  }
}

export interface PlatformSelectProps {
  value: string | null;
  onValueChange: (value: string | null) => void;
  disabled?: boolean;
}

export default function PlatformSelect({
  value,
  onValueChange,
  disabled = false,
}: PlatformSelectProps) {
  const id = useId();
  const collection = useMemo(
    () => createListCollection({ items: collectionItems }),
    []
  );

  const selectedValues = value ? [value] : [];
  const hasValue = Boolean(value);

  return (
    <SelectRoot
      collection={collection}
      value={selectedValues}
      onValueChange={(v) => {
        onValueChange(v.value[0] ?? null);
      }}
      disabled={disabled}
      multiple={false}
      positioning={{
        placement: "top-start",
        gutter: 6,
        flip: true,
        strategy: "fixed",
      }}
      id={`platform-select-${id}`}
    >
      <SelectControl
        className={cn(
          "group/chip inline-flex min-w-0 max-w-[min(100%,15rem)] shrink-0 items-stretch",
          "rounded-full border text-[11px] font-medium transition-[border-color,box-shadow] duration-200",
          "bg-card text-foreground",
          hasValue ? "border-primary" : "border-border hover:border-primary",
          disabled && "pointer-events-none opacity-50"
        )}
      >
        <SelectTrigger
          className={cn(
            "flex min-h-7 min-w-0 flex-1 cursor-pointer items-center gap-1.5 border-0 bg-transparent py-1 pl-2.5 pr-2 text-left outline-none",
            "focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-full",
            disabled && "cursor-not-allowed"
          )}
          aria-label="What platform is this for?"
        >
          {hasValue && value ? (
            <span className="flex shrink-0 items-center">
              <PlatformIcon value={value} />
            </span>
          ) : null}
          <span
            className={cn(
              "min-w-0 flex-1 truncate",
              hasValue ? "text-foreground" : "text-muted-foreground"
            )}
          >
            <SelectValueText placeholder={PLATFORM_PLACEHOLDER} />
          </span>

          <div className="flex shrink-0 items-center gap-0.5">
            <SelectIndicator className="flex shrink-0 text-muted-foreground">
              <ChevronDown className="size-3" strokeWidth={2} aria-hidden />
            </SelectIndicator>

            {hasValue ? (
              <div
                className={cn(
                  "flex shrink-0 items-center justify-center overflow-hidden transition-[width,opacity] duration-200 ease-out",
                  "w-0 opacity-0",
                  "group-hover/chip:w-4 group-hover/chip:opacity-100",
                  "[&:has(button:focus-visible)]:w-4 [&:has(button:focus-visible)]:opacity-100"
                )}
              >
                <SelectClearTrigger
                  type="button"
                  className={cn(
                    "flex size-3.5 shrink-0 cursor-pointer items-center justify-center rounded-sm",
                    "text-muted-foreground",
                    "hover:text-foreground",
                    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring/60"
                  )}
                  aria-label="Clear platform"
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <svg viewBox="0 0 20 20" className="size-3" aria-hidden>
                    <path
                      d="M6 6l8 8M14 6l-8 8"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </SelectClearTrigger>
              </div>
            ) : null}
          </div>
        </SelectTrigger>
      </SelectControl>

      <Portal>
        <SelectPositioner>
          <SelectContent
            className={cn(
              "z-[100] max-h-60 min-w-[var(--reference-width)] overflow-hidden rounded-lg border border-border bg-card shadow-lg",
              "data-[state=open]:animate-in data-[state=closed]:animate-out",
              "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
              "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
            )}
          >
            <SelectList className="max-h-60 overflow-y-auto py-1">
              {collection.items.map((item) => (
                <SelectItem
                  key={item.value}
                  item={item}
                  className={cn(
                    "flex cursor-pointer items-center justify-between gap-2 px-3 py-2 text-[12px] text-foreground outline-none",
                    "data-highlighted:bg-muted/90 data-highlighted:text-foreground",
                    "data-[state=checked]:bg-primary/15"
                  )}
                >
                  <span className="flex min-w-0 flex-1 items-center gap-2">
                    <PlatformIcon value={item.value} />
                    <SelectItemText className="truncate">{item.label}</SelectItemText>
                  </span>
                  <SelectItemIndicator className="shrink-0 text-primary">
                    <svg
                      viewBox="0 0 20 20"
                      className="size-4"
                      aria-hidden
                    >
                      <path
                        d="M5 10l3 3 7-7"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                    </svg>
                  </SelectItemIndicator>
                </SelectItem>
              ))}
            </SelectList>
          </SelectContent>
        </SelectPositioner>
      </Portal>

      <SelectHiddenSelect name="platform" />
    </SelectRoot>
  );
}
