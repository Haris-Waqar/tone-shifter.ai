export interface ToneGoal {
  id: string;
  label: string;
  description: string;
  color: string;
  emoji: string;
}

export interface ShiftRequest {
  message: string;
  goalId: string;
  /** Human-readable audience label for the prompt (e.g. "Your boss"). */
  audience?: string;
  /** Platform id from PLATFORM_ITEMS (e.g. "email", "slack"). */
  platform?: string;
}

export interface ShiftVariant {
  id: string;
  text: string;
  label: string;
  /** Present on new API responses; omitted on older saved history items. */
  tonePhrases?: string[];
}

export interface ShiftResponse {
  diagnosis: string;
  variants: ShiftVariant[];
}

export interface HistoryEntry {
  id: string;
  timestamp: number;
  message: string;
  goalId: string;
  /** Stable audience id from AUDIENCE_ITEMS, if any. */
  audience?: string;
  /** Stable platform id from PLATFORM_ITEMS, if any. */
  platform?: string;
  response: ShiftResponse;
}
