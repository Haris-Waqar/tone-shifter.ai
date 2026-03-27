import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

function glowStyle(
  duration: string,
  background: string,
  extra?: Pick<CSSProperties, "filter">
): CSSProperties {
  return {
    ["--glow-spin-duration" as string]: duration,
    background,
    ...extra,
  };
}

/**
 * Animated conic-gradient border (21st.dev–style).
 * Continuous keyframe rotation keeps motion visible while the textarea stays focused;
 * hover/focus-only transitions sit at one end state when focus never leaves the field.
 */
export default function MessageComposerGlow() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-2xl"
      aria-hidden
    >
      <div className="absolute inset-0 overflow-hidden rounded-2xl blur-[3px]">
        <div
          className="message-composer-glow-sweep"
          style={glowStyle(
            "14s",
            "conic-gradient(#000,#402fb5 5%,#000 38%,#000 50%,#cf30aa 60%,#000 87%)"
          )}
        />
      </div>
      <div className="absolute inset-0 overflow-hidden rounded-2xl blur-[3px]">
        <div
          className={cn(
            "message-composer-glow-sweep",
            "message-composer-glow-sweep--reverse"
          )}
          style={glowStyle(
            "11s",
            "conic-gradient(rgba(0,0,0,0),#18116a,rgba(0,0,0,0) 10%,rgba(0,0,0,0) 50%,#6e1b60,rgba(0,0,0,0) 60%)"
          )}
        />
      </div>
      <div className="absolute inset-0 overflow-hidden rounded-2xl blur-[2px]">
        <div
          className="message-composer-glow-sweep"
          style={glowStyle(
            "16s",
            "conic-gradient(rgba(0,0,0,0) 0%,#a099d8,rgba(0,0,0,0) 8%,rgba(0,0,0,0) 50%,#dfa2da,rgba(0,0,0,0) 58%)",
            { filter: "brightness(1.35)" }
          )}
        />
      </div>
      <div className="absolute inset-0 overflow-hidden rounded-2xl blur-[0.5px]">
        <div
          className={cn(
            "message-composer-glow-sweep",
            "message-composer-glow-sweep--reverse"
          )}
          style={glowStyle(
            "9s",
            "conic-gradient(#1c191c,#402fb5 5%,#1c191c 14%,#1c191c 50%,#cf30aa 60%,#1c191c 64%)",
            { filter: "brightness(1.25)" }
          )}
        />
      </div>
    </div>
  );
}
