"use client";
import SplitText from "@/app/components/reactbits/SplitText";

interface DiagnosisBannerProps {
  diagnosis?: string;
}

export default function DiagnosisBanner({ diagnosis }: DiagnosisBannerProps) {
  if (!diagnosis) return null;
  return (
    <div className="rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
      <span className="font-semibold text-foreground">Diagnosis: </span>
      <SplitText text={diagnosis} />
    </div>
  );
}
