import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          background: "#ffffff",
          borderRadius: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg viewBox="0 0 180 180" width="148" height="148">
          {/* Outer speedometer arc — blue base */}
          <path
            d="M 18 128 A 76 76 0 1 1 162 128"
            fill="none"
            stroke="#2563eb"
            strokeWidth="14"
            strokeLinecap="round"
          />
          {/* Cyan fast-side accent */}
          <path
            d="M 112 30 A 76 76 0 0 1 162 128"
            fill="none"
            stroke="#0891b2"
            strokeWidth="14"
            strokeLinecap="round"
          />
          {/* Purple slow-side accent */}
          <path
            d="M 18 128 A 76 76 0 0 1 40 60"
            fill="none"
            stroke="#7c3aed"
            strokeWidth="14"
            strokeLinecap="round"
          />
          {/* Needle */}
          <line
            x1="90" y1="96"
            x2="128" y2="42"
            stroke="#0891b2"
            strokeWidth="10"
            strokeLinecap="round"
          />
          {/* Needle tip */}
          <circle cx="128" cy="42" r="7" fill="#0891b2" />
          {/* Pivot */}
          <circle cx="90" cy="96" r="12" fill="#e0f2fe" stroke="#2563eb" strokeWidth="3" />
          <circle cx="90" cy="96" r="5" fill="#1d4ed8" />
          {/* WiFi pulse rings */}
          <path
            d="M 55 146 A 40 40 0 0 1 125 146"
            fill="none" stroke="#2563eb"
            strokeWidth="9" strokeLinecap="round"
          />
          <path
            d="M 68 146 A 24 24 0 0 1 112 146"
            fill="none" stroke="#0891b2"
            strokeWidth="9" strokeLinecap="round"
          />
          <path
            d="M 80 146 A 11 11 0 0 1 100 146"
            fill="none" stroke="#0891b2"
            strokeWidth="9" strokeLinecap="round"
          />
          <circle cx="90" cy="146" r="5" fill="#0891b2" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
