"use client";

import React from "react";
import type { Item, AccentColor } from "@/lib/types";
import { accentHex } from "@/lib/colors";
import { percentDone, computeStatus } from "@/lib/status";
import ProgressBar from "@/components/glass/ProgressBar";

interface Props {
  item: Item;
  todayLogged: number;
  pace: number;
  onClick?: () => void;
}

export default function OrbitNode({ item, todayLogged, pace, onClick }: Props) {
  const pct = percentDone(item);
  const status = computeStatus(item, pace, todayLogged);
  const colorHex = accentHex(item.color);

  return (
    <div
      onClick={onClick}
      style={{
        position: "absolute",
        left: "var(--x)",
        top: "var(--y)",
        width: "var(--w)",
        boxSizing: "border-box",
        border: "0.5px solid var(--border-glass)",
        borderTop: "1px solid var(--border-bright)",
        background: "rgba(255,255,255,0.035)",
        padding: "14px 16px",
        borderRadius: 14,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        cursor: "pointer",
        transition: "transform 0.2s, border-color 0.2s",
        zIndex: 3,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "var(--accent-blue)";
        (e.currentTarget as HTMLDivElement).style.transform = "scale(1.02)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border-glass)";
        (e.currentTarget as HTMLDivElement).style.transform = "scale(1)";
      }}
    >
      <div
        style={{
          fontSize: 11,
          color: colorHex,
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            background: colorHex,
            borderRadius: "50%",
          }}
        />
        {item.title}
      </div>

      <div style={{ fontSize: 22, fontWeight: 600, margin: "6px 0" }}>
        {status.label === "Goal Reached" ? "Finished ✓" : `${pct}%`}
      </div>

      <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 8 }}>
        {item.done_units} of {item.total_units} · due{" "}
        {item.due_date
          ? new Date(item.due_date).toLocaleDateString("en-US", { day: "numeric", month: "short" })
          : "—"}
      </div>

      <ProgressBar value={pct} color={item.color} height={4} />
    </div>
  );
}