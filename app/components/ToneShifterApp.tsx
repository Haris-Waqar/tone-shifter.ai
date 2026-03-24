"use client";
import { useState } from "react";
import type { ShiftResponse } from "@/lib/types";
import Magnet from "@/app/components/reactbits/Magnet";
import SplitText from "@/app/components/reactbits/SplitText";
import TextMorph from "@/app/components/reactbits/TextMorph";
import MessageInput from "@/app/components/MessageInput";
import GoalSelector from "@/app/components/GoalSelector";
import SubmitButton from "@/app/components/SubmitButton";
import DiagnosisBanner from "@/app/components/DiagnosisBanner";
import ResultsSkeleton from "@/app/components/ResultsSkeleton";
import VariantCard from "@/app/components/VariantCard";

const SUBTITLE_DEFAULT = "Rewrite messages with precision-tuned emotional tone";
const SUBTITLE_LOADING = "Shifting your tone...";

export default function ToneShifterApp() {
  const [message, setMessage] = useState("");
  const [goalId, setGoalId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<ShiftResponse | null>(null);

  const handleSubmit = async () => {
    if (!message.trim() || !goalId) return;
    setLoading(true);
    setError(null);
    setResponse(null);
    try {
      const res = await fetch("/api/shift", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, goalId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
      } else {
        setResponse(data as ShiftResponse);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center space-y-2">
          <Magnet>
            <h1 className="font-display text-4xl font-bold text-foreground">
              <SplitText text="Tone Shifter" />
            </h1>
          </Magnet>
          <p className="text-muted-foreground h-6">
            <TextMorph text={loading ? SUBTITLE_LOADING : SUBTITLE_DEFAULT} />
          </p>
        </div>

        <MessageInput value={message} onChange={setMessage} disabled={loading} />
        <GoalSelector selected={goalId} onSelect={setGoalId} />
        <SubmitButton
          onClick={handleSubmit}
          loading={loading}
          disabled={!message.trim() || !goalId}
        />

        {error && (
          <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </div>
        )}

        {loading && <ResultsSkeleton />}

        {response && !loading && (
          <div className="space-y-4">
            <DiagnosisBanner diagnosis={response.diagnosis} />
            {response.variants.map((v) => (
              <VariantCard key={v.id} variant={v} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
