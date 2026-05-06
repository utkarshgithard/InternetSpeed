"use client";

import { useEffect, useRef, useState } from "react";

interface GaugeProps {
  value: number;
  max: number;
  unit: string;
  label: string;
  color: "blue" | "green" | "purple" | "orange";
  size?: number;
  isActive?: boolean;
}

const colorMap = {
  blue: {
    stroke: "#3b82f6",
    glow: "rgba(59,130,246,0.6)",
    text: "gradient-text-blue",
    bg: "rgba(59,130,246,0.08)",
    shadow: "0 0 30px rgba(59,130,246,0.3)",
    trackStroke: "rgba(59,130,246,0.15)",
  },
  green: {
    stroke: "#10b981",
    glow: "rgba(16,185,129,0.6)",
    text: "gradient-text-green",
    bg: "rgba(16,185,129,0.08)",
    shadow: "0 0 30px rgba(16,185,129,0.3)",
    trackStroke: "rgba(16,185,129,0.15)",
  },
  purple: {
    stroke: "#8b5cf6",
    glow: "rgba(139,92,246,0.6)",
    text: "gradient-text-purple",
    bg: "rgba(139,92,246,0.08)",
    shadow: "0 0 30px rgba(139,92,246,0.3)",
    trackStroke: "rgba(139,92,246,0.15)",
  },
  orange: {
    stroke: "#f59e0b",
    glow: "rgba(245,158,11,0.6)",
    text: "gradient-text-orange",
    bg: "rgba(245,158,11,0.08)",
    shadow: "0 0 30px rgba(245,158,11,0.3)",
    trackStroke: "rgba(245,158,11,0.15)",
  },
};

export function SpeedGauge({
  value,
  max,
  unit,
  label,
  color,
  size = 180,
  isActive = false,
}: GaugeProps) {
  const colors = colorMap[color];
  const cx = size / 2;
  const cy = size / 2;
  const radius = (size / 2) * 0.75;
  const circumference = 2 * Math.PI * radius;
  const startAngle = -220;
  const sweepAngle = 260;

  const pct = Math.min(value / max, 1);
  const dashLen = (pct * sweepAngle * circumference) / 360;
  const dashOffset = circumference - dashLen;

  const [displayValue, setDisplayValue] = useState(0);
  const animRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (animRef.current) clearTimeout(animRef.current);
    const target = value;
    const start = displayValue;
    const duration = 800;
    const startTime = performance.now();

    const animate = () => {
      const now = performance.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(start + (target - start) * eased);
      if (progress < 1) {
        animRef.current = setTimeout(() => requestAnimationFrame(animate), 16);
      }
    };
    requestAnimationFrame(animate);

    return () => {
      if (animRef.current) clearTimeout(animRef.current);
    };
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  const svgRotate = `rotate(${startAngle + 90}, ${cx}, ${cy})`;

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="relative"
        style={{
          width: size,
          height: size,
          filter: isActive ? `drop-shadow(${colors.shadow})` : "none",
          transition: "filter 0.5s ease",
        }}
      >
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Background circle */}
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke={colors.trackStroke}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${(sweepAngle * circumference) / 360} ${circumference}`}
            transform={svgRotate}
          />
          {/* Progress arc */}
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke={colors.stroke}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${dashLen} ${circumference}`}
            strokeDashoffset={0}
            transform={svgRotate}
            className="gauge-progress"
            style={{
              filter: isActive
                ? `drop-shadow(0 0 6px ${colors.glow})`
                : "none",
            }}
          />
          {/* Active pulse ring */}
          {isActive && (
            <circle
              cx={cx}
              cy={cy}
              r={radius + 6}
              fill="none"
              stroke={colors.stroke}
              strokeWidth="1"
              opacity="0.3"
              className="pulse-ring"
            />
          )}
          {/* Center display */}
          <text
            x={cx}
            y={cy - 8}
            textAnchor="middle"
            fontSize={size * 0.18}
            fontWeight="700"
            fill={colors.stroke}
            fontFamily="Inter, system-ui, sans-serif"
          >
            {unit === "ms"
              ? Math.round(displayValue)
              : displayValue < 10
              ? displayValue.toFixed(1)
              : Math.round(displayValue)}
          </text>
          <text
            x={cx}
            y={cy + 14}
            textAnchor="middle"
            fontSize={size * 0.1}
            fill="#94a3b8"
            fontFamily="Inter, system-ui, sans-serif"
          >
            {unit}
          </text>
        </svg>
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-slate-400 uppercase tracking-widest">
          {label}
        </p>
      </div>
    </div>
  );
}
