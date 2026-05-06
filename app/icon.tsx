import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: "#ffffff",
          borderRadius: 7,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg viewBox="0 0 32 32" width="26" height="26">
          {/* Speedometer arc — vivid blue */}
          <path
            d="M 3 23 A 13.5 13.5 0 1 1 29 23"
            fill="none"
            stroke="#2563eb"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          {/* Cyan accent on the fast (right) side */}
          <path
            d="M 20 6.5 A 13.5 13.5 0 0 1 29 23"
            fill="none"
            stroke="#0891b2"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          {/* Needle — dark for contrast on white */}
          <line
            x1="16" y1="17"
            x2="22" y2="8"
            stroke="#0891b2"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Pivot dot */}
          <circle cx="16" cy="17" r="2.2" fill="#1d4ed8" />
          {/* WiFi pulse rings */}
          <path
            d="M 10 26 A 7 7 0 0 1 22 26"
            fill="none"
            stroke="#2563eb"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M 13 26 A 3.5 3.5 0 0 1 19 26"
            fill="none"
            stroke="#0891b2"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="16" cy="26" r="1.3" fill="#0891b2" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
