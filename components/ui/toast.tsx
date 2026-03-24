"use client";
import { createContext, useCallback, useContext, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

type ToastVariant = "error" | "success" | "info";

interface Toast {
  id: number;
  message: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  toast: (message: string, variant?: ToastVariant) => void;
}

const ToastContext = createContext<ToastContextValue>({ toast: () => {} });

let _nextId = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (message: string, variant: ToastVariant = "info") => {
      const id = _nextId++;
      setToasts((prev) => [...prev, { id, message, variant }]);
      setTimeout(() => dismiss(id), 4000);
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 items-end">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className={[
                "flex items-center gap-3 rounded-lg border px-4 py-3 text-sm shadow-lg max-w-sm",
                t.variant === "error"
                  ? "border-destructive/40 bg-destructive/10 text-destructive"
                  : t.variant === "success"
                  ? "border-green-500/40 bg-green-500/10 text-green-400"
                  : "border-border bg-card text-foreground",
              ].join(" ")}
            >
              <span className="flex-1">{t.message}</span>
              <button
                onClick={() => dismiss(t.id)}
                className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
              >
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
