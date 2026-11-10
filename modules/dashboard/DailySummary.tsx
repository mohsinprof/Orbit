import React from "react";
import GlassCard from "@/components/glass/GlassCard";
import ProgressBar from "@/components/glass/ProgressBar";

interface Props {
  loggedHours: number;
  targetHours: number;
}

export default function DailySummary({ loggedHours, targetHours }: Props) {
  const pct = targetHours > 0 ? Math.min(100, Math.round((loggedHours / targetHours) * 100)) : 0;
  const label =
    pct >= 100 ? "Today's Goal Completed 🎉" : `${pct}% of Today's Goal Completed`;

  return (
    <GlassCard>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8,
        }}
      >
        <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
          Daily Effort &amp; Progress Summary
        </span>
        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--accent-blue)" }}>
          {loggedHours.toFixed(1)}h / {targetHours.toFixed(1)}h Target
        </span>
      </div>
      <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: "-0.02em" }}>{label}</div>
      <ProgressBar value={pct} gradient height={6} />
    </GlassCard>
  );
}