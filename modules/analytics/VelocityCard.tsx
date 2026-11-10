import React from "react";
import GlassCard from "@/components/glass/GlassCard";
import { IconTrendingUp, IconTrendingDown } from "@tabler/icons-react";

interface Props {
  velocityPct: number; // e.g., 14 means +14%
  thisWeekHours: number;
  lastWeekHours: number;
}

export default function VelocityCard({ velocityPct, thisWeekHours, lastWeekHours }: Props) {
  const positive = velocityPct >= 0;
  const Icon = positive ? IconTrendingUp : IconTrendingDown;
  const color = positive ? "var(--accent-blue)" : "var(--accent-orange)";

  return (
    <GlassCard>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--text-muted)" }}>
          Weekly Velocity
        </h3>
        <Icon size={20} style={{ color }} />
      </div>

      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
        <span style={{ fontSize: 32, fontWeight: 700, color, letterSpacing: "-0.02em" }}>
          {positive ? "+" : ""}{velocityPct}%
        </span>
        <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
          vs last week
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 }}>
        <div style={{ padding: 12, background: "rgba(0,0,0,0.3)", borderRadius: 10, border: "0.5px solid var(--border-glass)" }}>
          <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>
            This week
          </div>
          <div style={{ fontSize: 18, fontWeight: 600 }}>
            {thisWeekHours.toFixed(1)}h
          </div>
        </div>
        <div style={{ padding: 12, background: "rgba(0,0,0,0.3)", borderRadius: 10, border: "0.5px solid var(--border-glass)" }}>
          <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>
            Last week
          </div>
          <div style={{ fontSize: 18, fontWeight: 600, color: "var(--text-muted)" }}>
            {lastWeekHours.toFixed(1)}h
          </div>
        </div>
      </div>
    </GlassCard>
  );
}