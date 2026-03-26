"use client";
import { TONE_GOALS } from "@/lib/goals";

interface GoalSelectorProps {
  selected?: string | null;
  onSelect?: (goalId: string) => void;
}

export default function GoalSelector({ selected, onSelect }: GoalSelectorProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {TONE_GOALS.map((goal) => (
        <button
          key={goal.id}
          onClick={() => onSelect?.(goal.id)}
          className="cursor-pointer px-4 py-2 rounded-full text-sm font-medium transition-all border border-border bg-card text-foreground hover:border-primary"
          style={
            selected === goal.id
              ? {
                  borderColor: goal.color,
                  color: goal.color,
                  backgroundColor: `${goal.color}18`,
                }
              : undefined
          }
        >
          {goal.label}
        </button>
      ))}
    </div>
  );
}
