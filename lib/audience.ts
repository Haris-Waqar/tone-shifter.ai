/** Preset audience options for the Audience select (value = stable id, label = prompt text). */
export const AUDIENCE_ITEMS: { label: string; value: string }[] = [
  { label: "Boss", value: "boss" },
  { label: "Team", value: "team" },
  { label: "Friend", value: "friend" },
  { label: "Client", value: "client" },
  { label: "Colleague", value: "colleague" },
  { label: "Executive", value: "executive" },
  { label: "Direct report", value: "direct-report" },
];

/** Human-readable string for the model prompt; undefined when none selected. */
export function getAudiencePromptLabel(value: string | null | undefined): string | undefined {
  if (value == null || value === "") return undefined;
  const item = AUDIENCE_ITEMS.find((i) => i.value === value);
  return item?.label;
}
