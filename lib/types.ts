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

export interface ToneScore {
  assertiveness: number;
  empathy: number;
  clarity: number;
  warmth: number;
}

export interface ShiftVariant {
  id: string;
  text: string;
  toneScore: ToneScore;
  label: string;
}

export interface ShiftResponse {
  diagnosis: string;
  variants: ShiftVariant[];
}
