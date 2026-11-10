import React from "react";
import type { AccentColor } from "@/lib/types";
import { accentHex } from "@/lib/colors";

interface Props {
  value: number; // 0-100
  color?: AccentColor;
  gradient?: boolean;
  height?: number;
}

export default function ProgressBar({ value, color = "blue", gradient = false, height = 6 }: Props) {
  const clamped = Math.max(0, Math.min(100, value));
  const fill = gradient
    ? `linear-gradient(90deg, var(--accent-red), var(--accent-orange))`
    : accentHex(color);

  return (
    <div
      style={{
        width: "100%",
        height,
        background: "rgba(255,255,255,0.1)",
        borderRadius: height / 2,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${clamped}%`,
          height: "100%",
          background: fill,
          borderRadius: height / 2,
          transition: "width 0.3s ease",
        }}
      />
    </div>
  );
}