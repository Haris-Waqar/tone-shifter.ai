"use client";
import { useCallback, useState } from "react";
import { motion, type Variants } from "framer-motion";
import type { ShiftResponse } from "@/lib/types";
import { useToast } from "@/components/ui/toast";
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

const resultsContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

// ease cast to avoid framer-motion v12 strict Easing tuple inference
const resultItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as any } },
};

export default function ToneShifterApp() {
  const [message, setMessage] = useState("");
  const [goalId, setGoalId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<ShiftResponse | null>(null);
  const { toast } = useToast();

  const handleSubmit = useCallback(async () => {
    if (!message.trim() || !goalId) return;
    setLoading(true);
    setResponse(null);
    try {
      const res = await fetch("/api/shift", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, goalId }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast(data.error ?? "Something went wrong.", "error");
      } else {
        setResponse(data as ShiftResponse);
      }
    } catch {
      toast("Network error. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }, [message, goalId, toast]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  return (
    <main
      className="min-h-screen bg-background flex items-start justify-center p-4 sm:p-6 pt-12 sm:pt-20"
      onKeyDown={handleKeyDown}
    >
      <div className="w-full max-w-2xl space-y-5">
        <div className="text-center space-y-2">
          <Magnet>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
              <SplitText text="Tone Shifter" />
            </h1>
          </Magnet>
          <p className="text-muted-foreground text-sm sm:text-base h-6">
            <TextMorph text={loading ? SUBTITLE_LOADING : SUBTITLE_DEFAULT} />
          </p>
        </div>

        <MessageInput
          value={message}
          onChange={setMessage}
          disabled={loading}
          maxLength={2000}
        />
        <GoalSelector selected={goalId} onSelect={setGoalId} />
        <SubmitButton
          onClick={handleSubmit}
          loading={loading}
          disabled={!message.trim() || !goalId}
        />

        {loading && <ResultsSkeleton />}

        {response && !loading && (
          <motion.div
            className="space-y-4"
            variants={resultsContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={resultItem}>
              <DiagnosisBanner diagnosis={response.diagnosis} />
            </motion.div>
            {response.variants.map((v) => (
              <motion.div key={v.id} variants={resultItem}>
                <VariantCard variant={v} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </main>
  );
}
