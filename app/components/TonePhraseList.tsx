"use client";

interface TonePhraseListProps {
  phrases?: string[];
}

export default function TonePhraseList({ phrases }: TonePhraseListProps) {
  if (!phrases?.length) return null;
  return (
    <div className="flex flex-wrap gap-1.5 pt-0.5">
      {phrases.map((phrase, index) => (
        <span
          key={`${index}-${phrase}`}
          className="inline-flex rounded-full border border-border bg-muted/40 px-2.5 py-0.5 text-[11px] font-medium leading-snug text-muted-foreground"
        >
          {phrase}
        </span>
      ))}
    </div>
  );
}
