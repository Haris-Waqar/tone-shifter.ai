"use client";
import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface CopyButtonProps {
  text?: string;
}

export default function CopyButton({ text }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="flex cursor-pointer items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
    >
      {copied ? (
        <>
          <Check size={12} />
          Copied!
        </>
      ) : (
        <>
          <Copy size={12} />
          Copy
        </>
      )}
    </button>
  );
}
