"use client";

import React from "react";
import type { OrbConfig } from "@/lib/orbTypes";

interface Props extends OrbConfig {
  onClick?: () => void;
  animateIn?: boolean;
  animateKey?: string; // changes to re-trigger animation
}

export default function Orb({
  variant,
  size,
  label,
  primary,
  secondary,
  accentColor,
  onClick,
  animateIn,
  animateKey,
}: Props) {
  const isAI = variant.startsWith("ai-");
  const isTimer = variant === "timer" || variant === "manual-timer";
  const isChat = variant === "chat";
  const isRemaining = variant === "remaining";

  // Color theming
  const gradient = (() => {
    if (isAI) {
      return "radial-gradient(circle, rgba(255,59,48,0.35) 0%, rgba(0,240,255,0.2) 50%, rgba(0,0,0,0.85) 100%)";
    }
    if (isTimer) {
      return "radial-gradient(circle, rgba(0,240,255,0.3) 0%, rgba(0,114,255,0.15) 50%, rgba(0,0,0,0.85) 100%)";
    }
    if (isRemaining) {
      return "radial-gradient(circle, rgba(255,149,0,0.3) 0%, rgba(255,59,48,0.15) 50%, rgba(0,0,0,0.85) 100%)";
    }
    if (isChat) {
      return "radial-gradient(circle, rgba(255,255,255,0.25) 0%, rgba(0,240,255,0.15) 60%, rgba(0,0,0,0.8) 100%)";
    }
    return "radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.85) 100%)";
  })();

  const borderColor = accentColor
    ? accentColor
    : isAI
    ? "rgba(255,255,255,0.4)"
    : isTimer
    ? "rgba(0,240,255,0.5)"
    : isRemaining
    ? "rgba(255,149,0,0.5)"
    : isChat
    ? "rgba(255,255,255,0.5)"
    : "rgba(255,255,255,0.2)";

  const glowColor = isAI
    ? "rgba(255,59,48,0.4)"
    : isTimer
    ? "rgba(0,240,255,0.4)"
    : isRemaining
    ? "rgba(255,149,0,0.4)"
    : isChat
    ? "rgba(255,255,255,0.3)"
    : "rgba(0,0,0,0.5)";

  return (
    <div
      key={animateKey}
      onClick={onClick}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: gradient,
        border: `1px solid ${borderColor}`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: `0 0 ${size * 0.3}px ${glowColor}, inset 0 0 ${size * 0.2}px rgba(0,0,0,0.5)`,
        cursor: onClick ? "pointer" : "default",
        transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), width 0.4s, height 0.4s",
        animation: animateIn ? "orbAppear 0.5s cubic-bezier(0.4, 0, 0.2, 1)" : undefined,
        textAlign: "center",
        position: "relative",
      }}
    >
      {/* Pulse ring for AI idle */}
      {variant === "ai-idle" && (
        <div
          style={{
            position: "absolute",
            inset: -8,
            borderRadius: "50%",
            border: "1px solid rgba(0,240,255,0.3)",
            animation: "orbPulse 3s ease-in-out infinite",
            pointerEvents: "none",
          }}
        />
      )}

      {primary && (
        <div
          style={{
            fontSize: size > 140 ? 22 : size > 100 ? 18 : 14,
            fontWeight: 700,
            color: "#fff",
            letterSpacing: "-0.02em",
            fontFamily: isTimer ? "ui-monospace, SFMono-Regular, Menlo, monospace" : "inherit",
          }}
        >
          {primary}
        </div>
      )}

      {secondary && (
        <div
          style={{
            fontSize: size > 140 ? 11 : 9,
            color: "var(--text-muted)",
            marginTop: 4,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          {secondary}
        </div>
      )}

      {label && (
        <div
          style={{
            position: "absolute",
            bottom: -24,
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: 11,
            color: "var(--text-muted)",
            whiteSpace: "nowrap",
            fontWeight: 500,
          }}
        >
          {label}
        </div>
      )}

      <style>{`
        @keyframes orbAppear {
          from { opacity: 0; transform: scale(0.7); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes orbPulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.1; transform: scale(1.15); }
        }
      `}</style>
    </div>
  );
}