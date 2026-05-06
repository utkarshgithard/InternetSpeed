"use client";

import { TestPhase } from "@/hooks/useSpeedTest";

interface ProgressBarProps {
  phase: TestPhase;
  progress: number;
  currentSpeed: number;
}

interface PhaseConfig {
  label: string;
  color: string;
  gradient: string;
  icon: string;
}

// Precomputed once at module load — fixes the "impure function during render" lint error.
// Values are stable across re-renders while still looking visually varied.
const WAVE_BARS = Array.from({ length: 20 }, (_, i) => ({
  height: 20 + ((i * 7 + 13) % 12),         // 20–31 px, deterministic
  opacity: 0.6 + ((i * 3 + 5) % 10) / 25,   // 0.60–1.00, deterministic
}));

const phases: Record<string, PhaseConfig> = {
  ping: {
    label: "Measuring Ping",
    color: "#8b5cf6",
    gradient: "linear-gradient(90deg, #8b5cf6, #a78bfa)",
    icon: "📡",
  },
  download: {
    label: "Testing Download",
    color: "#3b82f6",
    gradient: "linear-gradient(90deg, #3b82f6, #06b6d4)",
    icon: "⬇️",
  },
  upload: {
    label: "Testing Upload",
    color: "#10b981",
    gradient: "linear-gradient(90deg, #10b981, #34d399)",
    icon: "⬆️",
  },
};

export function ProgressBar({ phase, progress, currentSpeed }: ProgressBarProps) {
  const config = phases[phase];
  if (!config) return null;

  const showSpeed = (phase === "download" || phase === "upload") && currentSpeed > 0;

  return (
    <div className="w-full space-y-3 fade-in-up">
      {/* Phase label */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">{config.icon}</span>
          <span className="text-sm font-semibold text-slate-300">
            {config.label}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {showSpeed && (
            <span
              className="text-sm font-bold tabular-nums"
              style={{ color: config.color }}
            >
              {currentSpeed < 10
                ? currentSpeed.toFixed(1)
                : Math.round(currentSpeed)}{" "}
              Mbps
            </span>
          )}
          <span className="text-xs text-slate-500 font-medium">
            {Math.round(progress)}%
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="progress-bar-track">
        <div
          className="progress-bar-fill"
          style={{
            width: `${progress}%`,
            background: config.gradient,
            boxShadow: `0 0 12px ${config.color}80`,
          }}
        />
      </div>

      {/* Wave animation bars */}
      {showSpeed && (
        <div className="flex items-end justify-center gap-1 h-8">
          {WAVE_BARS.map((bar, i) => (
            <div
              key={i}
              className="wave-bar rounded-sm"
              style={{
                width: "3px",
                height: `${bar.height}px`,
                background: config.color,
                opacity: bar.opacity,
                animationDelay: `${(i * 60) % 1200}ms`,
                animationDuration: `${800 + (i * 50) % 400}ms`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
