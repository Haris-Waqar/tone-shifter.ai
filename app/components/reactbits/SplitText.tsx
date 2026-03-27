"use client";
import { motion, type Variants } from "framer-motion";
import { useIsClient } from "@/lib/hooks";

interface SplitTextProps {
  text: string;
  className?: string;
}

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.025 } },
};

const charVariant: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.25, 0, 0, 1] },
  },
};

/** Words + whitespace runs — avoids per-char inline-block, which allowed mid-word line breaks. */
function segmentText(text: string): string[] {
  return text.match(/\S+|\s+/g) ?? [];
}

export default function SplitText({ text, className }: SplitTextProps) {
  const isClient = useIsClient();

  if (!isClient) {
    return <span className={className}>{text}</span>;
  }

  const segments = segmentText(text);

  return (
    <motion.span
      className={className}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {segments.map((segment, i) => (
        <motion.span
          key={i}
          variants={charVariant}
          style={{
            display: "inline-block",
            whiteSpace: segment.trim() === "" ? "pre" : "normal",
          }}
        >
          {segment}
        </motion.span>
      ))}
    </motion.span>
  );
}
