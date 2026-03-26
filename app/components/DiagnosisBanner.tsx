"use client";
import SplitText from "@/app/components/reactbits/SplitText";

interface DiagnosisBannerProps {
  diagnosis?: string;
}

export default function DiagnosisBanner({ diagnosis }: DiagnosisBannerProps) {
  if (!diagnosis) return null;
  return (
    <p className="text-sm leading-relaxed text-foreground">
      <SplitText text={diagnosis} />
    </p>
  );
}
