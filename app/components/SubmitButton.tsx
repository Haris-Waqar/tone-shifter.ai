"use client";
import ShimmerButton from "@/components/ui/shimmer-button";

interface SubmitButtonProps {
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export default function SubmitButton({ onClick, loading, disabled }: SubmitButtonProps) {
  return (
    <ShimmerButton onClick={onClick} disabled={disabled || loading}>
      {loading ? "Shifting..." : "Shift Tone"}
    </ShimmerButton>
  );
}
