import React from "react";

interface Props {
  label?: string;
}

export default function LoadingState({ label = "Loading…" }: Props) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 24px",
        gap: 10,
        color: "var(--text-muted)",
        fontSize: 13,
      }}
    >
      <span
        style={{
          width: 14,
          height: 14,
          borderRadius: "50%",
          border: "2px solid rgba(255,255,255,0.15)",
          borderTopColor: "var(--accent-blue)",
          animation: "spin 0.8s linear infinite",
          display: "inline-block",
        }}
      />
      {label}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}