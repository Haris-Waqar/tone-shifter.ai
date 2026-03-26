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
        tonePhrases: z.array(z.string()).min(2).max(4),
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

OPENING HOOK (diagnosis field): Write a short, natural intro in normal prose—no headings, labels, or prefixes. Use two beats in one flowing paragraph (at most 2–3 sentences):
1) Describe how the original message reads (e.g., terse and informal, slightly unclear but straightforward, overly formal, passive-aggressive).
2) Bridge to the rewrites below with a line like "Here are three tailored rewrites" or "Below are three options tuned for your goal" (vary wording; keep it conversational).

Example shape (do not copy verbatim): "The message is terse and informal, with a slightly unclear but straightforward conversational tone. Here are three tailored rewrites toward the ${goalLabel} register."

VARIANTS:
- If the original message is coherent and has clear semantic intent, return exactly 3 rewrites labeled Subtle, Balanced, and Bold:
- Subtle: ~20–30% tonal shift toward the ${goalLabel} goal
- Balanced: ~50–60% tonal shift toward the ${goalLabel} goal
- Bold: ~80–90% shift — full, clear expression of the ${goalLabel} register
- If the original message is gibberish, placeholder text, random characters, or otherwise lacks enough meaning to rewrite responsibly, return an empty array for variants.

For each variant, add tonePhrases: 2–4 short qualitative phrases describing how that rewrite reads (e.g., "Mild assertive", "Less clear", "More warmth"). Pick what matters for that text—you do not need to cover fixed dimensions. Phrases must reflect the variant's actual wording, not the goal in the abstract.

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
