interface GradientTextProps {
  text: string;
  className?: string;
}

export default function GradientText({ text, className }: GradientTextProps) {
  return (
    <span
      className={className}
      style={{
        background: "linear-gradient(90deg, #7c6dfa, #a78bfa, #14b8a6, #3b82f6, #7c6dfa)",
        backgroundSize: "300% 100%",
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        color: "transparent",
        WebkitTextFillColor: "transparent",
        animation: "gradient-flow 6s ease-in-out infinite",
        display: "inline-block",
      }}
    >
      {text}
    </span>
  );
}
