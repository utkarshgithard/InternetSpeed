import { ImageResponse } from "next/og";

// 32×32 favicon — Next.js serves this at /icon and auto-injects <link rel="icon">
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: "#0a0e1a",
          borderRadius: 6,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg viewBox="0 0 32 32" width="28" height="28">
          {/* Speedometer arc — blue */}
          <path
            d="M 3 23 A 13.5 13.5 0 1 1 29 23"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Cyan accent on right portion of arc */}
          <path
            d="M 20 6.5 A 13.5 13.5 0 0 1 29 23"
            fill="none"
            stroke="#06b6d4"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Needle pointing upper-right (high speed!) */}
          <line
            x1="16" y1="17"
            x2="22" y2="8"
            stroke="#06b6d4"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Pivot dot */}
          <circle cx="16" cy="17" r="2.2" fill="#06b6d4" />
          {/* WiFi pulse — 2 arcs below needle */}
          <path
            d="M 10 26 A 7 7 0 0 1 22 26"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.85"
          />
          <path
            d="M 13 26 A 3.5 3.5 0 0 1 19 26"
            fill="none"
            stroke="#06b6d4"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.85"
          />
          <circle cx="16" cy="26" r="1.2" fill="#06b6d4" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
