import React from "react";

interface Props {
  dateLabel: string; // e.g. "6 November"
  label?: string;
}

export default function OrbitCenter({ dateLabel, label = "Your Orbit" }: Props) {
  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 140,
        height: 140,
        borderRadius: "50%",
        background:
          "radial-gradient(circle, rgba(255,59,48,0.3) 0%, rgba(0,240,255,0.15) 60%, rgba(0,0,0,0.8) 100%)",
        border: "1px solid rgba(255,255,255,0.4)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 0 40px rgba(0,240,255,0.2)",
        textAlign: "center",
        zIndex: 2,
      }}
    >
      <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{dateLabel}</div>
      <div style={{ fontSize: 16, fontWeight: 600, color: "#fff" }}>{label}</div>
    </div>
  );
}