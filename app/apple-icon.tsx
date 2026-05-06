import { ImageResponse } from "next/og";

// 180×180 Apple touch icon — shown when user adds site to iOS home screen
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          background: "#0a0e1a",
          borderRadius: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg viewBox="0 0 180 180" width="148" height="148">
          {/* Outer speedometer arc */}
          <path
            d="M 18 128 A 76 76 0 1 1 162 128"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="14"
            strokeLinecap="round"
          />
          {/* Cyan accent on fast side */}
          <path
            d="M 112 30 A 76 76 0 0 1 162 128"
            fill="none"
            stroke="#06b6d4"
            strokeWidth="14"
            strokeLinecap="round"
          />
          {/* Purple on slow side */}
          <path
            d="M 18 128 A 76 76 0 0 1 40 60"
            fill="none"
            stroke="#8b5cf6"
            strokeWidth="14"
            strokeLinecap="round"
          />
          {/* Needle */}
          <line
            x1="90" y1="96"
            x2="128" y2="42"
            stroke="#06b6d4"
            strokeWidth="10"
            strokeLinecap="round"
          />
          {/* Needle tip glow */}
          <circle cx="128" cy="42" r="7" fill="#06b6d4" opacity="0.9" />
          {/* Pivot */}
          <circle cx="90" cy="96" r="12" fill="#1e2a40" />
          <circle cx="90" cy="96" r="5" fill="#06b6d4" />
          {/* WiFi pulse rings */}
          <path
            d="M 55 146 A 40 40 0 0 1 125 146"
            fill="none" stroke="#3b82f6"
            strokeWidth="9" strokeLinecap="round" opacity="0.85"
          />
          <path
            d="M 68 146 A 24 24 0 0 1 112 146"
            fill="none" stroke="#06b6d4"
            strokeWidth="9" strokeLinecap="round" opacity="0.85"
          />
          <path
            d="M 80 146 A 11 11 0 0 1 100 146"
            fill="none" stroke="#06b6d4"
            strokeWidth="9" strokeLinecap="round" opacity="0.85"
          />
          <circle cx="90" cy="146" r="5" fill="#06b6d4" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
