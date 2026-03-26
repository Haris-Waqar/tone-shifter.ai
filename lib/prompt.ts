import { z } from "zod";
import { TONE_GOALS } from "./goals";

export const ShiftResponseSchema = z.object({
  diagnosis: z.string(),
  variants: z
    .array(
      z.object({
        id: z.string(),
        text: z.string(),
        label: z.enum(["Subtle", "Balanced", "Bold"]),
        toneScore: z.object({
          assertiveness: z.number().min(0).max(100),
          empathy: z.number().min(0).max(100),
          clarity: z.number().min(0).max(100),
          warmth: z.number().min(0).max(100),
        }),
      })
    )
    .max(3),
});

export function buildShiftPrompt(message: string, goalId: string): string {
  const goal = TONE_GOALS.find((g) => g.id === goalId);
  const goalLabel = goal?.label ?? goalId;
  const goalDescription = goal?.description ?? "";

  return `You are an expert communication coach specializing in tone. Your task is to rewrite the following message so it achieves the "${goalLabel}" tone (${goalDescription}).

Provide:

DIAGNOSIS: One sentence describing the current tone register of the original message (e.g., passive-aggressive, overly formal, too casual, etc.).

VARIANTS:
- If the original message is coherent and has clear semantic intent, return exactly 3 rewrites labeled Subtle, Balanced, and Bold:
- Subtle: ~20–30% tonal shift toward the ${goalLabel} goal
- Balanced: ~50–60% tonal shift toward the ${goalLabel} goal
- Bold: ~80–90% shift — full, clear expression of the ${goalLabel} register
- If the original message is gibberish, placeholder text, random characters, or otherwise lacks enough meaning to rewrite responsibly, return an empty array for variants.

TONE SCORES: For each variant, score these 4 axes 0–100 based on the actual text (not the goal):
- assertiveness: how direct and confident the message is
- empathy: how warm and understanding the message is
- clarity: how clear and unambiguous the message is
- warmth: how friendly and approachable the message is

IDs: use "subtle", "balanced", "bold" (lowercase) for the variant ids.

Constraints:
- Keep each variant's length within ±30% of the original message's word count
- No meta-commentary, labels, or explanations inside the variant text itself — just the rewritten message
- Do not invent intent or meaning that is not present in the original message

Original message:
"""
${message}
"""`;
}
