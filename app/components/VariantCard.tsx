"use client";
import type { ShiftVariant } from "@/lib/types";
import GlowCard from "@/app/components/reactbits/GlowCard";
import CopyButton from "@/app/components/CopyButton";
import TonePhraseList from "@/app/components/TonePhraseList";

interface VariantCardProps {
  variant?: ShiftVariant;
}

export default function VariantCard({ variant }: VariantCardProps) {
  if (!variant) return null;
  return (
    <GlowCard className="rounded-lg border border-border bg-card p-4">
      <div className="relative z-10 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {variant.label}
          </span>
          <CopyButton text={variant.text} />
        </div>
        <p className="text-foreground text-sm">{variant.text}</p>
        <TonePhraseList phrases={variant.tonePhrases} />
      </div>
    </GlowCard>
  );
}
