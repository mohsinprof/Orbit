"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { accentHex } from "@/lib/colors";
import { percentDone, isBehindSchedule } from "@/lib/status";
import ProgressBar from "@/components/glass/ProgressBar";
import {
  IconPlayerPlay,
  IconPlayerPause,
  IconAlertTriangle,
  IconChevronRight,
} from "@tabler/icons-react";
import type { Item } from "@/lib/types";

interface Props {
  item: Item;
  compact?: boolean;  // corner slot variant
  slim?: boolean;     // side stack variant when task running
  flat?: boolean;     // manual mode list variant
  isActive?: boolean;
  onStart?: () => void;
  onPause?: () => void;
}

export default function TaskCard({
  item,
  compact,
  slim,
  flat,
  isActive,
  onStart,
  onPause,
}: Props) {
  const router = useRouter();
  const pct = percentDone(item);
  const colorHex = accentHex(item.color);
  const behind = isBehindSchedule(item);

  if (slim) {
    return (
      <button
        onClick={() => router.push(`/items/${item.id}`)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 10px",
          background: "rgba(255,255,255,0.03)",
          border: "0.5px solid var(--border-glass)",
          borderRadius: 10,
          color: "var(--text-main)",
          fontSize: 12,
          cursor: "pointer",
          textAlign: "left",
          width: "100%",
        }}
      >
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: colorHex, flexShrink: 0 }} />
        <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {item.title}
        </span>
        <IconPlayerPlay size={12} style={{ color: "var(--accent-blue)" }} />
      </button>
    );
  }

  if (compact) {
    return (
      <div
        onClick={() => router.push(`/items/${item.id}`)}
        className="glass-card"
        style={{ padding: 12, cursor: "pointer" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: colorHex }} />
          <span style={{ fontSize: 11, color: colorHex, fontWeight: 600, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {item.title}
          </span>
          {behind && <IconAlertTriangle size={11} style={{ color: "var(--accent-orange)" }} />}
        </div>
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 2 }}>{pct}%</div>
        <div style={{ fontSize: 10, color: "var(--text-muted)", marginBottom: 8 }}>
          {item.done_units} / {item.total_goal} {item.unit}
          {item.roll_over_hours > 0 && (
            <span style={{ marginLeft: 4, color: "var(--accent-orange)" }}>
              · +{item.roll_over_hours}h
            </span>
          )}
        </div>
        <ProgressBar value={pct} color={item.color} height={4} />
        <button
          onClick={(e) => {
            e.stopPropagation();
            onStart?.();
          }}
          style={{
            marginTop: 10,
            width: "100%",
            padding: "6px",
            background: "rgba(0,240,255,0.1)",
            border: "0.5px solid rgba(0,240,255,0.3)",
            borderRadius: 8,
            color: "var(--accent-blue)",
            fontSize: 11,
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
          }}
        >
          <IconPlayerPlay size={12} /> Start
        </button>
      </div>
    );
  }

  // flat (manual mode list)
  return (
    <div
      onClick={() => router.push(`/items/${item.id}`)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 14px",
        background: isActive ? "rgba(0,240,255,0.05)" : "rgba(255,255,255,0.02)",
        border: isActive ? "0.5px solid rgba(0,240,255,0.3)" : "0.5px solid var(--border-glass)",
        borderRadius: 12,
        cursor: "pointer",
      }}
    >
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: colorHex, flexShrink: 0 }} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 14, fontWeight: 600 }}>{item.title}</span>
          {behind && (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 3,
                padding: "2px 6px",
                background: "rgba(255,149,0,0.15)",
                border: "0.5px solid rgba(255,149,0,0.3)",
                borderRadius: 6,
                fontSize: 10,
                color: "var(--accent-orange)",
                fontWeight: 600,
              }}
            >
              <IconAlertTriangle size={9} /> Behind
            </span>
          )}
        </div>
        <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
          {item.done_units} / {item.total_goal} {item.unit} · daily {item.daily_target}{item.unit}
          {item.roll_over_hours > 0 && (
            <span style={{ marginLeft: 6, color: "var(--accent-orange)" }}>
              · +{item.roll_over_hours}h roll-over
            </span>
          )}
        </div>
        <div style={{ marginTop: 6 }}>
          <ProgressBar value={pct} color={behind ? "orange" : item.color} height={4} />
        </div>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          isActive ? onPause?.() : onStart?.();
        }}
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          padding: 0,
          background: isActive
            ? "rgba(255,149,0,0.15)"
            : "rgba(0,240,255,0.1)",
          border: isActive
            ? "0.5px solid rgba(255,149,0,0.4)"
            : "0.5px solid rgba(0,240,255,0.3)",
          color: isActive ? "var(--accent-orange)" : "var(--accent-blue)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        aria-label={isActive ? "Pause" : "Start"}
      >
        {isActive ? <IconPlayerPause size={14} /> : <IconPlayerPlay size={14} />}
      </button>

      <IconChevronRight size={16} style={{ color: "var(--text-muted)" }} />
    </div>
  );
}