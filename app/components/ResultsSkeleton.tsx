"use client";

export default function ResultsSkeleton() {
  return (
    <div className="h-full rounded-lg border border-border bg-card/95 p-5">
      <div className="space-y-4 animate-pulse">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="h-3 w-24 rounded-full bg-primary/25" />
            <div className="h-4 w-56 rounded-full bg-foreground/10" />
          </div>
          <div className="h-9 w-9 rounded-full bg-primary/20" />
        </div>
        <div className="h-3 w-full rounded-full bg-foreground/10" />
        <div className="h-3 w-5/6 rounded-full bg-foreground/10" />
        <div className="h-px w-full bg-border" />
        <div className="grid gap-2 sm:grid-cols-3">
          <div className="h-16 rounded-lg bg-primary/12" />
          <div className="h-16 rounded-lg bg-primary/10" />
          <div className="h-16 rounded-lg bg-primary/8" />
        </div>
      </div>
    </div>
  );
}
