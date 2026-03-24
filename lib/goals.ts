import type { ToneGoal } from "./types";

export const TONE_GOALS: ToneGoal[] = [
  {
    id: "assertive",
    label: "Assertive",
    description: "Clear, confident, direct",
    color: "var(--tone-assertive)",
    emoji: "💪",
  },
  {
    id: "empathetic",
    label: "Empathetic",
    description: "Warm, understanding, supportive",
    color: "var(--tone-empathetic)",
    emoji: "🤝",
  },
  {
    id: "professional",
    label: "Professional",
    description: "Formal, polished, business-ready",
    color: "var(--tone-professional)",
    emoji: "💼",
  },
  {
    id: "playful",
    label: "Playful",
    description: "Light, fun, energetic",
    color: "var(--tone-playful)",
    emoji: "🎉",
  },
  {
    id: "direct",
    label: "Direct",
    description: "No fluff, straight to the point",
    color: "var(--tone-direct)",
    emoji: "🎯",
  },
  {
    id: "diplomatic",
    label: "Diplomatic",
    description: "Tactful, balanced, considerate",
    color: "var(--tone-diplomatic)",
    emoji: "🕊️",
  },
];
