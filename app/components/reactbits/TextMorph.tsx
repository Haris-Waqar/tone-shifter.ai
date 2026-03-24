"use client";
import { AnimatePresence, motion } from "framer-motion";

interface TextMorphProps {
  text: string;
  className?: string;
}

export default function TextMorph({ text, className }: TextMorphProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={text}
        className={className}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
      >
        {text}
      </motion.span>
    </AnimatePresence>
  );
}
