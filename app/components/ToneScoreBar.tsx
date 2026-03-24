"use client";
import { motion } from "framer-motion";
import type { ToneScore } from "@/lib/types";

interface ToneScoreBarProps {
  score?: ToneScore;
}

export default function ToneScoreBar({ score }: ToneScoreBarProps) {
  if (!score) return null;
  return (
    <div className="space-y-1">
      {Object.entries(score).map(([key, value], index) => (
        <div key={key} className="flex items-center gap-2 text-xs">
          <span className="w-24 capitalize text-muted-foreground">{key}</span>
          <div className="flex-1 h-1.5 rounded-full bg-muted">
            <motion.div
              className="h-1.5 rounded-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${value}%` }}
              transition={{ duration: 0.6, delay: index * 0.08, ease: "easeOut" }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
