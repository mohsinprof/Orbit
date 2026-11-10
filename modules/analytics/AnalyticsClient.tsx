"use client";

import React from "react";
import GlassCard from "@/components/glass/GlassCard";
import EffortChart from "./EffortChart";
import DistributionChart from "./DistributionChart";
import VelocityCard from "./VelocityCard";
import { MOCK_EFFORT_7D, MOCK_DISTRIBUTION } from "@/lib/mock/data";

export default function AnalyticsClient() {
  const thisWeekHours = MOCK_EFFORT_7D.reduce((s, d) => s + d.hours, 0); // 36.3h
  const lastWeekHours = 31.9; // mock — gives +14%
  const velocityPct = Math.round(((thisWeekHours - lastWeekHours) / lastWeekHours) * 100);

  const totalHours = MOCK_DISTRIBUTION.reduce((s, d) => s + d.value, 0);

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
        <SummaryStat
          label="Total effort (7d)"
          value={`${thisWeekHours.toFixed(1)}h`}
          accent="var(--accent-blue)"
        />
        <SummaryStat
          label="Daily avg (7d)"
          value={`${(thisWeekHours / 7).toFixed(1)}h`}
          accent="var(--accent-orange)"
        />
        <SummaryStat
          label="Active items"
          value={String(MOCK_DISTRIBUTION.length)}
          accent="var(--accent-red)"
        />
        <SummaryStat
          label="Best day"
          value={`${Math.max(...MOCK_EFFORT_7D.map((d) => d.hours))}h`}
          accent="var(--text-main)"
        />
      </div>

      <VelocityCard
        velocityPct={velocityPct}
        thisWeekHours={thisWeekHours}
        lastWeekHours={lastWeekHours}
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
        <GlassCard>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>7-Day Effort (Hours)</h3>
          <EffortChart />
        </GlassCard>
        <GlassCard>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Task Effort Distribution</h3>
          <DistributionChart />
          <div style={{ marginTop: 12, paddingTop: 12, borderTop: "0.5px solid var(--border-glass)", fontSize: 12, color: "var(--text-muted)", textAlign: "center" }}>
            Total tracked: {totalHours}%
          </div>
        </GlassCard>
      </div>
    </>
  );
}

function SummaryStat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <GlassCard style={{ padding: 16 }}>
      <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ fontSize: 22, fontWeight: 700, color: accent, letterSpacing: "-0.02em" }}>
        {value}
      </div>
    </GlassCard>
  );
}