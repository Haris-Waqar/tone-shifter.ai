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
  response: ShiftResponse;
}
