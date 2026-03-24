"use client";
import { useCallback, useEffect, useState } from "react";
import { motion, type Variants } from "framer-motion";
import { History, RefreshCw } from "lucide-react";
import type { HistoryEntry, ShiftResponse } from "@/lib/types";
import { addHistoryEntry, loadHistory } from "@/lib/history";
import { useToast } from "@/components/ui/toast";
import Magnet from "@/app/components/reactbits/Magnet";
import SplitText from "@/app/components/reactbits/SplitText";
import TextMorph from "@/app/components/reactbits/TextMorph";
import GradientText from "@/components/GradientText";
import MessageInput from "@/app/components/MessageInput";
import GoalSelector from "@/app/components/GoalSelector";
import SubmitButton from "@/app/components/SubmitButton";
import DiagnosisBanner from "@/app/components/DiagnosisBanner";
import ResultsSkeleton from "@/app/components/ResultsSkeleton";
import VariantCard from "@/app/components/VariantCard";
import HistoryPanel from "@/app/components/HistoryPanel";

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
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const submitRequest = useCallback(
    async (msg: string, goal: string) => {
      setLoading(true);
      setResponse(null);
      try {
        const res = await fetch("/api/shift", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: msg, goalId: goal }),
        });
        const data = await res.json();
        if (!res.ok) {
          toast(data.error ?? "Something went wrong.", "error");
        } else {
          const shifted = data as ShiftResponse;
          setResponse(shifted);
          const entry: HistoryEntry = {
            id: crypto.randomUUID(),
            timestamp: Date.now(),
            message: msg,
            goalId: goal,
            response: shifted,
          };
          addHistoryEntry(entry);
          setHistory(loadHistory());
        }
      } catch {
        toast("Network error. Please try again.", "error");
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  const handleSubmit = useCallback(() => {
    if (!message.trim() || !goalId) return;
    submitRequest(message, goalId);
  }, [message, goalId, submitRequest]);

  const handleRegenerate = useCallback(() => {
    if (!message.trim() || !goalId) return;
    submitRequest(message, goalId);
  }, [message, goalId, submitRequest]);

  const handleRestore = useCallback((entry: HistoryEntry) => {
    setMessage(entry.message);
    setGoalId(entry.goalId);
    setResponse(entry.response);
  }, []);

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
    <>
      <HistoryPanel
        open={historyOpen}
        entries={history}
        onClose={() => setHistoryOpen(false)}
        onRestore={handleRestore}
        onEntriesChange={setHistory}
      />

      <main
        className="min-h-screen flex items-start justify-center p-4 sm:p-6 pt-12 sm:pt-20"
        onKeyDown={handleKeyDown}
      >
        <div className="w-full max-w-2xl space-y-5">
          {/* Header */}
          <div className="relative text-center space-y-2">
            <button
              onClick={() => setHistoryOpen(true)}
              className="absolute right-0 top-0 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <History size={15} />
              {history.length > 0 && (
                <span className="bg-primary text-primary-foreground rounded-full px-1.5 py-0.5 text-[10px] font-semibold leading-none">
                  {history.length}
                </span>
              )}
            </button>

            <Magnet>
              <h1 className="font-display text-3xl sm:text-4xl font-bold">
                <GradientText className="cursor-default font-display text-3xl sm:text-4xl font-bold">
                  Tone Shifter
                </GradientText>
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

              {/* Regenerate */}
              <motion.div variants={resultItem} className="flex justify-center pt-1">
                <button
                  onClick={handleRegenerate}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground border border-border hover:border-primary/50 rounded-lg px-4 py-2 transition-colors"
                >
                  <RefreshCw size={14} />
                  Regenerate
                </button>
              </motion.div>
            </motion.div>
          )}
        </div>
      </main>
    </>
  );
}
