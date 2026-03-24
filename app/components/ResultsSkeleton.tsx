"use client";

export default function ResultsSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-lg border border-border bg-card p-4 h-24" />
      ))}
    </div>
  );
}
