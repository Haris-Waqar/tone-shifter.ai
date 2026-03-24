"use client";
import React from "react";
import { motion } from "framer-motion";
import { useIsClient } from "@/lib/hooks";

interface BorderBeamProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
  duration?: number;
  disabled?: boolean;
}

export default function BorderBeam({
  children,
  className,
  color = "#f97316",
  duration = 4,
  disabled = false,
}: BorderBeamProps) {
  const isClient = useIsClient();

  return (
    <div className={`relative ${className ?? ""}`}>
      {isClient && !disabled && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration, repeat: Infinity, ease: "linear" }}
          style={{
            position: "absolute",
            inset: -1,
            borderRadius: "inherit",
            background: `conic-gradient(from 0deg, transparent 70%, ${color} 85%, transparent 95%)`,
            pointerEvents: "none",
          }}
        />
      )}
      {children}
    </div>
  );
}
