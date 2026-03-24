"use client";
import { AnimatePresence, motion } from "framer-motion";
import { Trash2, X, Clock } from "lucide-react";
import type { HistoryEntry } from "@/lib/types";
import { TONE_GOALS } from "@/lib/goals";
import { clearHistory, removeHistoryEntry } from "@/lib/history";

interface HistoryPanelProps {
  open: boolean;
  entries: HistoryEntry[];
  onClose: () => void;
  onRestore: (entry: HistoryEntry) => void;
  onEntriesChange: (entries: HistoryEntry[]) => void;
}

function relativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days = Math.floor(diff / 86_400_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export default function HistoryPanel({
  open,
  entries,
  onClose,
  onRestore,
  onEntriesChange,
}: HistoryPanelProps) {
  const handleRemove = (id: string) => {
    removeHistoryEntry(id);
    onEntriesChange(entries.filter((e) => e.id !== id));
  };

  const handleClear = () => {
    clearHistory();
    onEntriesChange([]);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.aside
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm bg-card border-l border-border flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-muted-foreground" />
                <span className="font-semibold text-sm text-foreground">
                  History
                </span>
                {entries.length > 0 && (
                  <span className="text-xs text-muted-foreground">
                    ({entries.length})
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {entries.length > 0 && (
                  <button
                    onClick={handleClear}
                    className="text-xs text-muted-foreground hover:text-destructive transition-colors"
                  >
                    Clear all
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto py-2">
              {entries.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground">
                  <Clock size={32} strokeWidth={1} />
                  <p className="text-sm">No shifts yet</p>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {entries.map((entry) => {
                    const goal = TONE_GOALS.find((g) => g.id === entry.goalId);
                    return (
                      <motion.div
                        key={entry.id}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
                        transition={{ duration: 0.2 }}
                        className="group mx-2 mb-1 rounded-lg border border-border bg-background hover:border-primary/50 transition-colors cursor-pointer"
                        onClick={() => {
                          onRestore(entry);
                          onClose();
                        }}
                      >
                        <div className="p-3 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-foreground">
                              {goal?.emoji} {goal?.label ?? entry.goalId}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">
                                {relativeTime(entry.timestamp)}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemove(entry.id);
                                }}
                                className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                            {entry.message}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
