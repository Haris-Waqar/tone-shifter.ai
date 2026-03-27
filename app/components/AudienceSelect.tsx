"use client";

import { useId, useMemo } from "react";
import {
  ArrowDownToLine,
  Award,
  Briefcase,
  ChevronDown,
  Crown,
  Heart,
  UserRound,
  UsersRound,
} from "lucide-react";
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
import { AUDIENCE_ITEMS } from "@/lib/audience";

/** Shown when no audience is chosen (pairs with the Platform chip). */
const AUDIENCE_PLACEHOLDER = "Audience";

const collectionItems = AUDIENCE_ITEMS.map(({ value, label }) => ({ value, label }));

const iconClass = "size-3 shrink-0 text-muted-foreground";

function AudienceIcon({ value }: { value: string }) {
  switch (value) {
    case "boss":
      return <Crown className={iconClass} strokeWidth={2} aria-hidden />;
    case "team":
      return <UsersRound className={iconClass} strokeWidth={2} aria-hidden />;
    case "friend":
      return <Heart className={iconClass} strokeWidth={2} aria-hidden />;
    case "client":
      return <Briefcase className={iconClass} strokeWidth={2} aria-hidden />;
    case "colleague":
      return <UserRound className={iconClass} strokeWidth={2} aria-hidden />;
    case "executive":
      return <Award className={iconClass} strokeWidth={2} aria-hidden />;
    case "direct-report":
      return <ArrowDownToLine className={iconClass} strokeWidth={2} aria-hidden />;
    default:
      return null;
  }
}

export interface AudienceSelectProps {
  value: string | null;
  onValueChange: (value: string | null) => void;
  disabled?: boolean;
}

export default function AudienceSelect({
  value,
  onValueChange,
  disabled = false,
}: AudienceSelectProps) {
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
      id={`audience-select-${id}`}
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
          aria-label="Who are you writing to?"
        >
          {hasValue && value ? (
            <span className="flex shrink-0 items-center">
              <AudienceIcon value={value} />
            </span>
          ) : null}
          <span
            className={cn(
              "min-w-0 flex-1 truncate",
              hasValue ? "text-foreground" : "text-muted-foreground"
            )}
          >
            <SelectValueText placeholder={AUDIENCE_PLACEHOLDER} />
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
                  aria-label="Clear audience"
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
                    <AudienceIcon value={item.value} />
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

      <SelectHiddenSelect name="audience" />
    </SelectRoot>
  );
}
