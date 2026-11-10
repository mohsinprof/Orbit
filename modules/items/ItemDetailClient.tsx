"use client";

import React, { useState } from "react";
import Link from "next/link";
import { IconArrowLeft, IconPlayerPause, IconPlayerPlay, IconAlertTriangle, IconClock, IconCalendar, IconFlag } from "@tabler/icons-react";
import GlassCard from "@/components/glass/GlassCard";
import GlassButton from "@/components/glass/GlassButton";
import ProgressBar from "@/components/glass/ProgressBar";
import { accentHex } from "@/lib/colors";
import { percentDone, computeStatus, isBehindSchedule, priorityLabel } from "@/lib/status";
import { mockItems, mockFolders, mockSessions } from "@/lib/mock/data";
import { mockItemSessions, mockItemProgressLogs, mockPlanEntries, mockChanges } from "@/lib/mock/detail";
import LogProgressForm from "./LogProgressForm";
import SessionList from "./SessionList";
import PlanEntryList from "./PlanEntryList";
import AliasChips from "./AliasChips";
import HistoryList from "./HistoryList";
import ChapterList from "./ChapterList";

interface Props {
  itemId: string;
}

export default function ItemDetailClient({ itemId }: Props) {
  const item = mockItems.find((i) => i.id === itemId);
  const [tab, setTab] = useState<"progress" | "chapters" | "sessions" | "plan" | "history">("progress");
  const [notes, setNotes] = useState(item?.notes ?? "");

  if (!item) {
    return (
      <GlassCard>
        <div style={{ fontSize: 14, color: "var(--text-muted)" }}>Item not found.</div>
      </GlassCard>
    );
  }

  const folder = item.folder_id ? mockFolders.find((f) => f.id === item.folder_id) : null;
  const pct = percentDone(item);
  const status = computeStatus(item, 2.0, 0);
  const colorHex = accentHex(item.color);
  const behind = isBehindSchedule(item);
  const itemSessions = mockSessions.filter((s) => s.item_id === item.id).concat(
    mockItemSessions.filter((s) => s.item_id === item.id)
  );
  const itemLogs = mockItemProgressLogs.filter((l) => l.item_id === item.id);
  const itemPlan = mockPlanEntries.filter((p) => p.item_id === item.id);
  const itemChanges = mockChanges;

  const tabs = [
    { id: "progress" as const, label: "Progress" },
    { id: "chapters" as const, label: `Chapters (${item.chapters.filter((c) => c.done).length}/${item.chapters.length})` },
    { id: "sessions" as const, label: "Sessions" },
    { id: "plan" as const, label: "Plan" },
    { id: "history" as const, label: "History" },
  ];

  return (
    <>
      <Link href="/home" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--text-muted)", fontSize: 13, textDecoration: "none" }}>
        <IconArrowLeft size={16} /> Back
      </Link>

      {/* Header */}
      <GlassCard>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
          <div>
            {folder && (
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>
                in {folder.title}
              </div>
            )}
            <h2 style={{ fontSize: 22, fontWeight: 700, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: colorHex }} />
              {item.title}
              {behind && (
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 4,
                  padding: "3px 8px", background: "rgba(255,149,0,0.15)",
                  border: "0.5px solid rgba(255,149,0,0.3)", borderRadius: 6,
                  fontSize: 11, color: "var(--accent-orange)", fontWeight: 600,
                }}>
                  <IconAlertTriangle size={10} /> Behind
                </span>
              )}
            </h2>
            <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 6, display: "flex", gap: 12, flexWrap: "wrap" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                <IconFlag size={12} /> {priorityLabel(item.priority)}
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                <IconClock size={12} /> {item.daily_target}{item.unit}/day
              </span>
              {item.due_date && (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                  <IconCalendar size={12} /> due {new Date(item.due_date).toLocaleDateString("en-US", { day: "numeric", month: "short" })}
                </span>
              )}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <GlassButton variant="primary" icon={<IconPlayerPlay size={16} />}>Start Timer</GlassButton>
          </div>
        </div>

        <div style={{ marginTop: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: 13, color: "var(--text-muted)" }}>Progress</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: colorHex }}>
              {item.done_units} / {item.total_goal} {item.unit} ({pct}%)
            </span>
          </div>
          <ProgressBar value={pct} color={behind ? "orange" : item.color} height={8} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginTop: 20 }}>
          <Stat label="Total Goal" value={`${item.total_goal} ${item.unit}`} />
          <Stat label="Daily Target" value={`${item.daily_target} ${item.unit}`} accent />
          <Stat label="Deadline" value={item.deadline_days ? `${item.deadline_days} days` : "—"} />
          <Stat label="Roll-over" value={`+${item.roll_over_hours}h`} warn={item.roll_over_hours > 2} />
        </div>
      </GlassCard>

      {/* Aliases */}
      <GlassCard>
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 10, color: "var(--text-muted)" }}>Aliases</h3>
        <AliasChips aliases={item.aliases} />
      </GlassCard>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, padding: 4, background: "rgba(0,0,0,0.3)", borderRadius: 12, alignSelf: "flex-start", overflowX: "auto", maxWidth: "100%" }}>
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: "8px 14px",
              fontSize: 13,
              fontWeight: 600,
              background: tab === t.id ? "rgba(255,255,255,0.08)" : "transparent",
              border: "none",
              borderRadius: 8,
              color: tab === t.id ? "var(--text-main)" : "var(--text-muted)",
              whiteSpace: "nowrap",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "progress" && (
        <GlassCard>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: "var(--text-muted)" }}>Log progress</h3>
          <LogProgressForm item={item} />
          <h3 style={{ fontSize: 14, fontWeight: 600, margin: "20px 0 10px", color: "var(--text-muted)" }}>Notes</h3>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes…" rows={4} style={{ resize: "vertical" }} />
          <h3 style={{ fontSize: 14, fontWeight: 600, margin: "20px 0 10px", color: "var(--text-muted)" }}>Recent logs</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {itemLogs.map((log) => (
              <div key={log.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", borderRadius: 8, border: "0.5px solid var(--border-glass)" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>+{log.amount} {item.unit}</div>
                  {log.note && <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{log.note}</div>}
                </div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", textAlign: "right" }}>
                  {new Date(log.logged_at).toLocaleDateString("en-US", { day: "numeric", month: "short" })}
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {tab === "chapters" && (
        <GlassCard>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: "var(--text-muted)" }}>Chapters / Subtasks</h3>
          <ChapterList chapters={item.chapters} />
        </GlassCard>
      )}

      {tab === "sessions" && (
        <GlassCard>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: "var(--text-muted)" }}>Sessions</h3>
          <SessionList sessions={itemSessions} />
        </GlassCard>
      )}

      {tab === "plan" && (
        <GlassCard>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: "var(--text-muted)" }}>Plan entries</h3>
          <PlanEntryList entries={itemPlan} />
        </GlassCard>
      )}

      {tab === "history" && (
        <GlassCard>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: "var(--text-muted)" }}>Change history</h3>
          <HistoryList changes={itemChanges} />
        </GlassCard>
      )}
    </>
  );
}

function Stat({ label, value, accent, warn }: { label: string; value: string; accent?: boolean; warn?: boolean }) {
  return (
    <div style={{ padding: 12, background: "rgba(0,0,0,0.3)", borderRadius: 10, border: "0.5px solid var(--border-glass)" }}>
      <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 15, fontWeight: 600, color: warn ? "var(--accent-orange)" : accent ? "var(--accent-blue)" : "var(--text-main)" }}>{value}</div>
    </div>
  );
}