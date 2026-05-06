"use client";

import { TestResult, TestPhase } from "@/hooks/useSpeedTest";

interface ResultCardProps {
  title: string;
  value: number | null;
  unit: string;
  phase: TestPhase;
  activePhase: "ping" | "download" | "upload";
  icon: React.ReactNode;
  color: "purple" | "blue" | "green";
  description: string;
}

const colorStyles = {
  purple: {
    border: "border-purple-500/20",
    activeBorder: "border-purple-400/50",
    glow: "glow-purple",
    label: "text-purple-400",
    valueColor: "gradient-text-purple",
    bg: "bg-purple-500/5",
    activeBg: "bg-purple-500/10",
    dot: "bg-purple-400",
    dotGlow: "shadow-[0_0_8px_rgba(139,92,246,0.8)]",
  },
  blue: {
    border: "border-blue-500/20",
    activeBorder: "border-blue-400/50",
    glow: "glow-blue",
    label: "text-blue-400",
    valueColor: "gradient-text-blue",
    bg: "bg-blue-500/5",
    activeBg: "bg-blue-500/10",
    dot: "bg-blue-400",
    dotGlow: "shadow-[0_0_8px_rgba(59,130,246,0.8)]",
  },
  green: {
    border: "border-emerald-500/20",
    activeBorder: "border-emerald-400/50",
    glow: "glow-green",
    label: "text-emerald-400",
    valueColor: "gradient-text-green",
    bg: "bg-emerald-500/5",
    activeBg: "bg-emerald-500/10",
    dot: "bg-emerald-400",
    dotGlow: "shadow-[0_0_8px_rgba(16,185,129,0.8)]",
  },
};

function AnimatedValue({
  value,
  unit,
  color,
}: {
  value: number | null;
  unit: string;
  color: "purple" | "blue" | "green";
}) {
  const styles = colorStyles[color];

  if (value === null) {
    return (
      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-black text-slate-700">--</span>
        <span className="text-base text-slate-600">{unit}</span>
      </div>
    );
  }

  const formatted =
    unit === "ms"
      ? Math.round(value).toString()
      : value < 10
      ? value.toFixed(1)
      : Math.round(value).toString();

  return (
    <div className="flex items-baseline gap-2 fade-in-up">
      <span className={`text-4xl font-black tabular-nums ${styles.valueColor}`}>
        {formatted}
      </span>
      <span className={`text-base font-semibold ${styles.label}`}>{unit}</span>
    </div>
  );
}

function StatusIndicator({
  isActive,
  isDone,
  color,
}: {
  isActive: boolean;
  isDone: boolean;
  color: "purple" | "blue" | "green";
}) {
  const styles = colorStyles[color];

  if (isDone) {
    return (
      <div className="flex items-center gap-1.5">
        <div
          className={`w-2 h-2 rounded-full ${styles.dot} ${styles.dotGlow}`}
        />
        <span className={`text-xs font-medium ${styles.label}`}>Done</span>
      </div>
    );
  }

  if (isActive) {
    return (
      <div className="flex items-center gap-1.5">
        <div
          className={`w-2 h-2 rounded-full ${styles.dot} ${styles.dotGlow} pulse-ring`}
        />
        <span className={`text-xs font-medium ${styles.label}`}>Testing...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <div className="w-2 h-2 rounded-full bg-slate-700" />
      <span className="text-xs text-slate-600">Waiting</span>
    </div>
  );
}

export function ResultCard({
  title,
  value,
  unit,
  phase,
  activePhase,
  icon,
  color,
  description,
}: ResultCardProps) {
  const styles = colorStyles[color];
  const isActive = phase === activePhase;
  const isDone = value !== null;

  return (
    <div
      className={`
        rounded-2xl p-6 border transition-all duration-500 card-hover
        ${isActive ? `${styles.activeBg} ${styles.activeBorder} ${styles.glow}` : `${styles.bg} ${styles.border}`}
        glass-card
      `}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`
              w-10 h-10 rounded-xl flex items-center justify-center text-xl
              ${isActive ? styles.activeBg : styles.bg}
              border ${isActive ? styles.activeBorder : styles.border}
              transition-all duration-300
            `}
          >
            {icon}
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">{title}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{description}</p>
          </div>
        </div>
        <StatusIndicator isActive={isActive} isDone={isDone} color={color} />
      </div>

      {/* Value */}
      <AnimatedValue value={value} unit={unit} color={color} />

      {/* Active indicator bar */}
      {isActive && (
        <div className="mt-4 progress-bar-track">
          <div
            className="progress-bar-fill h-full"
            style={{
              width: "60%",
              background:
                color === "blue"
                  ? "linear-gradient(90deg, #3b82f6, #06b6d4)"
                  : color === "green"
                  ? "linear-gradient(90deg, #10b981, #34d399)"
                  : "linear-gradient(90deg, #8b5cf6, #a78bfa)",
              animation: "indeterminate 1.5s ease-in-out infinite",
            }}
          />
        </div>
      )}
    </div>
  );
}
