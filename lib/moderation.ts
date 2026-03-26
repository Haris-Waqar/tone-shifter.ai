import openai from "@/lib/openai";

const MIN_SUBSTANTIVE_LENGTH = 12;
const MAX_UNIQUE_CHAR_RATIO_FOR_GIBBERISH = 0.28;
const MAX_VOWEL_RATIO_FLOOR = 0.2;

function longestConsonantRun(input: string): number {
  let longest = 0;
  let current = 0;

  for (const char of input) {
    if (/[bcdfghjklmnpqrstvwxyz]/i.test(char)) {
      current += 1;
      longest = Math.max(longest, current);
    } else {
      current = 0;
    }
  }

  return longest;
}

function isLikelyGibberish(input: string): boolean {
  const normalized = input.trim().toLowerCase();
  const lettersOnly = normalized.replace(/[^a-z]/g, "");

  if (lettersOnly.length < MIN_SUBSTANTIVE_LENGTH) {
    return false;
  }

  const uniqueCharRatio = new Set(lettersOnly).size / lettersOnly.length;
  const vowelCount = (lettersOnly.match(/[aeiou]/g) ?? []).length;
  const vowelRatio = vowelCount / lettersOnly.length;
  const hasLongRepeatedChar = /(.)\1{5,}/.test(normalized);
  const hasLongConsonantRun = longestConsonantRun(lettersOnly) >= 8;

  return (
    hasLongRepeatedChar ||
    hasLongConsonantRun ||
    (uniqueCharRatio < MAX_UNIQUE_CHAR_RATIO_FOR_GIBBERISH &&
      vowelRatio < MAX_VOWEL_RATIO_FLOOR)
  );
}

export type ModerationCheckResult = {
  allowed: boolean;
  reason?: "gibberish" | "unsafe";
  flaggedCategories?: string[];
};

export async function moderateUserMessage(
  message: string
): Promise<ModerationCheckResult> {
  if (isLikelyGibberish(message)) {
    return { allowed: false, reason: "gibberish" };
  }

  const moderation = await openai.moderations.create({
    model: "omni-moderation-latest",
    input: message,
  });

  const result = moderation.results[0];
  if (!result) {
    throw new Error("Moderation returned no result");
  }

  if (!result.flagged) {
    return { allowed: true };
  }

  const flaggedCategories = Object.entries(result.categories)
    .filter(([, value]) => value)
    .map(([category]) => category);

  return {
    allowed: false,
    reason: "unsafe",
    flaggedCategories,
  };
}
