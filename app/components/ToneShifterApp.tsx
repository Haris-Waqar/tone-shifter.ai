"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { ChevronDown, History, RefreshCw } from "lucide-react";
import { APP_TITLE } from "@/lib/app";
import type { HistoryEntry, ShiftResponse } from "@/lib/types";
import { addHistoryEntry, loadHistory } from "@/lib/history";
import { useToast } from "@/components/ui/toast";
import TextMorph from "@/app/components/reactbits/TextMorph";
import GradientText from "@/components/GradientText";
import MessageInput from "@/app/components/MessageInput";
import GoalSelector from "@/app/components/GoalSelector";
import DiagnosisBanner from "@/app/components/DiagnosisBanner";
import { AiLoader } from "@/components/ui/ai-loader";
import VariantCard from "@/app/components/VariantCard";
import HistoryPanel from "@/app/components/HistoryPanel";
import { useMediaQuery } from "@/lib/hooks";
import { cn } from "@/lib/utils";

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
  const [resultsHeight, setResultsHeight] = useState<string | null>(null);
  const [resultsScrollable, setResultsScrollable] = useState(false);
  const [resultsAtBottom, setResultsAtBottom] = useState(true);
  const mainRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const composerRef = useRef<HTMLDivElement>(null);
  const resultsScrollRef = useRef<HTMLDivElement>(null);
  const resultsContentRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const isDesktopLayout = useMediaQuery("(min-width: 768px)", true);

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

  const showResultsRegion = loading || response !== null;
  const isCenteredState = !showResultsRegion;

  const updateResultsScrollState = useCallback(() => {
    const container = resultsScrollRef.current;
    if (!container) {
      setResultsScrollable(false);
      setResultsAtBottom(true);
      return;
    }

    const scrollable = container.scrollHeight - container.clientHeight > 12;
    const atBottom =
      container.scrollHeight - container.clientHeight - container.scrollTop <= 12;

    setResultsScrollable(scrollable);
    setResultsAtBottom(atBottom);
  }, []);

  const updateResultsHeight = useCallback(() => {
    if (!showResultsRegion || !mainRef.current || !headerRef.current || !composerRef.current) {
      setResultsHeight(null);
      return;
    }

    const mainRect = mainRef.current.getBoundingClientRect();
    const headerRect = headerRef.current.getBoundingClientRect();
    const composerRect = composerRef.current.getBoundingClientRect();
    const verticalGap = 40;
    const viewportOffset = mainRect.top + (window.innerHeight - mainRect.bottom);
    const occupiedHeight =
      Math.ceil(headerRect.height + composerRect.height + verticalGap + viewportOffset);

    setResultsHeight(`calc(100dvh - ${occupiedHeight}px)`);
    requestAnimationFrame(updateResultsScrollState);
  }, [showResultsRegion, updateResultsScrollState]);

  useEffect(() => {
    if (!showResultsRegion) {
      setResultsHeight(null);
      setResultsScrollable(false);
      setResultsAtBottom(true);
      return;
    }

    if (!isDesktopLayout) {
      setResultsHeight(null);
      requestAnimationFrame(updateResultsScrollState);
      return;
    }

    updateResultsHeight();

    const handleResize = () => updateResultsHeight();
    window.addEventListener("resize", handleResize);

    const observer = new ResizeObserver(() => updateResultsHeight());
    if (headerRef.current) observer.observe(headerRef.current);
    if (composerRef.current) observer.observe(composerRef.current);
    if (resultsContentRef.current) observer.observe(resultsContentRef.current);

    return () => {
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
    };
  }, [
    loading,
    response,
    showResultsRegion,
    isDesktopLayout,
    updateResultsHeight,
    updateResultsScrollState,
  ]);

  useEffect(() => {
    if (!showResultsRegion || isDesktopLayout) return;
    requestAnimationFrame(updateResultsScrollState);
  }, [loading, response, showResultsRegion, isDesktopLayout, updateResultsScrollState]);

  const scrollResultsToBottom = useCallback(() => {
    const container = resultsScrollRef.current;
    if (!container) return;

    container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
  }, []);

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
        ref={mainRef}
        className={`flex justify-center p-4 sm:p-6 ${
          isCenteredState
            ? "min-h-screen items-center"
            : "max-md:min-h-[100dvh] max-md:h-auto max-md:overflow-y-auto max-md:overflow-x-hidden max-md:items-stretch max-md:pb-[max(1rem,env(safe-area-inset-bottom))] md:h-[100dvh] md:overflow-hidden md:items-start pt-12 sm:pt-20 max-md:pt-6"
        }`}
        onKeyDown={handleKeyDown}
      >
        <motion.div
          layout
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className={`w-full max-w-2xl ${
            showResultsRegion
              ? "flex min-h-0 flex-col gap-5 max-md:w-full max-md:self-stretch md:h-full"
              : "space-y-5"
          }`}
        >
          {/* Header */}
          <motion.div ref={headerRef} layout className="relative shrink-0 text-center space-y-2">
            <button
              onClick={() => setHistoryOpen(true)}
              aria-label="Open history"
              title="History"
              className="absolute right-0 top-1 flex h-4 w-4 cursor-pointer items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
            >
              <span className="relative inline-flex">
                <History size={16} />
                {history.length > 0 && (
                  <span className="absolute right-0 top-0 min-w-4 translate-x-1/2 -translate-y-1/2 rounded-full bg-primary px-1 py-0.5 text-center text-[10px] font-semibold leading-none text-primary-foreground">
                    {history.length}
                  </span>
                )}
              </span>
            </button>

            <h1
              className={cn(
                "font-display text-4xl sm:text-5xl font-bold",
                showResultsRegion && "max-md:text-3xl"
              )}
            >
              <GradientText
                className={cn(
                  "cursor-default font-display text-4xl sm:text-5xl font-bold",
                  showResultsRegion && "max-md:text-3xl"
                )}
              >
                {APP_TITLE}
              </GradientText>
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base h-6">
              <TextMorph text={loading ? SUBTITLE_LOADING : SUBTITLE_DEFAULT} />
            </p>
          </motion.div>

          <AnimatePresence mode="popLayout" initial={false}>
            {showResultsRegion && (
              <motion.div
                key="results"
                layout
                className="min-h-0 w-full max-md:min-h-[min(46vh,24rem)] max-md:flex-none md:min-h-0"
                initial={{ opacity: 0, y: -18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                style={
                  isDesktopLayout && resultsHeight ? { height: resultsHeight } : undefined
                }
              >
                {loading ? (
                  <div className="flex h-full min-h-0 w-full items-center justify-center overflow-hidden max-md:min-h-[min(12rem,34vh)]">
                    <AiLoader size={isDesktopLayout ? 180 : 112} />
                  </div>
                ) : response ? (
                  <motion.div
                    className="flex h-full min-h-0 flex-col gap-4"
                    variants={resultsContainer}
                    initial="hidden"
                    animate="visible"
                  >
                    <div className="relative min-h-0 flex-1">
                      <div
                        ref={resultsScrollRef}
                        onScroll={updateResultsScrollState}
                        className={cn(
                          "h-full overflow-y-auto pr-2",
                          resultsScrollable &&
                            !resultsAtBottom &&
                            "max-md:pb-12"
                        )}
                      >
                        <div ref={resultsContentRef} className="space-y-4 pb-1">
                          <motion.div variants={resultItem}>
                            <DiagnosisBanner diagnosis={response.diagnosis} />
                          </motion.div>
                          {response.variants.map((v) => (
                            <motion.div key={v.id} variants={resultItem}>
                              <VariantCard variant={v} />
                            </motion.div>
                          ))}
                        </div>
                      </div>
                      {resultsScrollable && !resultsAtBottom && (
                        <button
                          onClick={scrollResultsToBottom}
                          aria-label="Scroll to bottom"
                          title="Scroll to bottom"
                          className={cn(
                            "absolute bottom-3 z-20 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-primary/55 bg-primary/35 text-white shadow-lg shadow-primary/30 backdrop-blur-md transition-colors hover:bg-primary/45",
                            "left-1/2 -translate-x-1/2",
                            "max-md:left-auto max-md:right-3 max-md:translate-x-0"
                          )}
                        >
                          <ChevronDown size={13} />
                        </button>
                      )}
                    </div>
                    <motion.div variants={resultItem} className="flex shrink-0 justify-end pt-1">
                      <button
                        onClick={handleRegenerate}
                        aria-label="Regenerate results"
                        title="Regenerate"
                        className="cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <RefreshCw size={16} />
                      </button>
                    </motion.div>
                  </motion.div>
                ) : null}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            ref={composerRef}
            layout
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="shrink-0 space-y-5"
          >
            <MessageInput
              value={message}
              onChange={setMessage}
              disabled={loading}
              maxLength={2000}
              onSubmit={handleSubmit}
              loading={loading}
              submitDisabled={!message.trim() || !goalId}
            />
            <GoalSelector selected={goalId} onSelect={setGoalId} />
          </motion.div>
        </motion.div>
      </main>
    </>
  );
}
