"use client";
import { TONE_GOALS } from "@/lib/goals";
import { cn } from "@/lib/utils";

interface GoalSelectorProps {
  selected?: string | null;
  onSelect?: (goalId: string) => void;
}

export default function GoalSelector({ selected, onSelect }: GoalSelectorProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {TONE_GOALS.map((goal) => {
        const isSelected = selected === goal.id;
        return (
          <button
            key={goal.id}
            type="button"
            onClick={() => onSelect?.(goal.id)}
            aria-pressed={isSelected}
            className={cn(
              "cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition-all",
              "bg-card text-foreground",
              isSelected
                ? "border-primary"
                : "border-border hover:border-primary",
            )}
          >
            {goal.label}
          </button>
        );
      })}
    </div>
  );
}
