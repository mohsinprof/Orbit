"use client";

import React from "react";
import GlassCard from "@/components/glass/GlassCard";
import EffortChart from "@/modules/analytics/EffortChart";
import DistributionChart from "@/modules/analytics/DistributionChart";
import { MOCK_EFFORT_7D, MOCK_DISTRIBUTION, mockItems } from "@/lib/mock/data";
import { accentHex } from "@/lib/colors";
import { percentDone, isBehindSchedule, priorityLabel } from "@/lib/status";
import { IconClock, IconAlertTriangle, IconCheck, IconFlag } from "@tabler/icons-react";

export default function StatsDashboard() {
  const totalHours = MOCK_EFFORT_7D.reduce((s, d) => s + d.hours, 0);
  const dailyAvg = totalHours / 7;
  const behindCount = mockItems.filter(isBehindSchedule).length;
  const doneCount = mockItems.filter((i) => i.status === "done").length;

  return (
    <>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>Dashboard</h1>
        <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>
          Weekly stats · completion rates · trends
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
        <StatCard label="Total effort (7d)" value={`${totalHours.toFixed(1)}h`} icon={<IconClock size={16} />} accent="var(--accent-blue)" />
        <StatCard label="Daily average" value={`${dailyAvg.toFixed(1)}h`} icon={<IconClock size={16} />} accent="var(--accent-orange)" />
        <StatCard label="Behind schedule" value={String(behindCount)} icon={<IconAlertTriangle size={16} />} accent="var(--accent-orange)" />
        <StatCard label="Completed" value={String(doneCount)} icon={<IconCheck size={16} />} accent="#00E676" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
        <GlassCard>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>7-Day Effort</h3>
          <EffortChart />
        </GlassCard>
        <GlassCard>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Task Distribution</h3>
          <DistributionChart />
        </GlassCard>
      </div>

      <GlassCard>
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>All Tasks Overview</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {mockItems.map((item) => {
            const pct = percentDone(item);
            const behind = isBehindSchedule(item);
            return (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 12px",
                  borderRadius: 10,
                  border: "0.5px solid var(--border-glass)",
                }}
              >
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: accentHex(item.color) }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, display: "flex", alignItems: "center", gap: 6 }}>
                    {item.title}
                    {behind && <IconAlertTriangle size={11} style={{ color: "var(--accent-orange)" }} />}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                    {item.done_units}/{item.total_goal} {item.unit} · {pct}%
                  </div>
                </div>
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 4,
                  fontSize: 10, color: "var(--text-muted)",
                  padding: "2px 6px", background: "rgba(255,255,255,0.05)",
                  borderRadius: 6,
                }}>
                  <IconFlag size={10} /> {priorityLabel(item.priority)}
                </span>
              </div>
            );
          })}
        </div>
      </GlassCard>
    </>
  );
}

function StatCard({ label, value, icon, accent }: { label: string; value: string; icon: React.ReactNode; accent: string }) {
  return (
    <GlassCard style={{ padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>{label}</span>
        <span style={{ color: accent }}>{icon}</span>
      </div>
      <div style={{ fontSize: 22, fontWeight: 700, color: accent }}>{value}</div>
    </GlassCard>
  );
}