/** Preset platforms for the composer chip (value = stable id). */
export const PLATFORM_ITEMS: {
  value: string;
  label: string;
  promptInstruction: string;
}[] = [
  {
    value: "email",
    label: "Email",
    promptInstruction:
      "Format as a professional email. Include a subject line on its own line. Use standard email structure with greeting, body paragraphs, and sign-off.",
  },
  {
    value: "slack",
    label: "Slack",
    promptInstruction:
      "Format as a Slack message. Keep it concise and conversational — ideally under 3 sentences. No subject line, no formal sign-off. Emoji are acceptable if they fit the tone.",
  },
  {
    value: "linkedin",
    label: "LinkedIn",
    promptInstruction:
      "Format as a LinkedIn message or post. Professional but approachable. No subject line. Keep paragraphs short for readability on the platform.",
  },
  {
    value: "text-message",
    label: "Text message",
    promptInstruction:
      "Format as a text/SMS message. Very brief and casual. No greeting or sign-off unless the original has one. Use short sentences.",
  },
];

export function getPlatformPromptInstruction(
  value: string | null | undefined
): string | undefined {
  if (value == null || value === "") return undefined;
  const item = PLATFORM_ITEMS.find((i) => i.value === value);
  return item?.promptInstruction;
}

export function getPlatformLabel(value: string | null | undefined): string | undefined {
  if (value == null || value === "") return undefined;
  const item = PLATFORM_ITEMS.find((i) => i.value === value);
  return item?.label;
}
