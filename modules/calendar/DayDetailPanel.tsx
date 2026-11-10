"use client";

import React from "react";
import Link from "next/link";
import { accentHex } from "@/lib/colors";
import { getEntriesForDay, CALENDAR_MONTH } from "@/lib/mock/calendar";
import GlassCard from "@/components/glass/GlassCard";
import GlassButton from "@/components/glass/GlassButton";
import { IconPlus, IconX } from "@tabler/icons-react";

interface Props {
  day: number | null;
  onClose: () => void;
}

export default function DayDetailPanel({ day, onClose }: Props) {
  if (day === null) {
    return (
      <GlassCard>
        <div style={{ fontSize: 14, color: "var(--text-muted)", textAlign: "center", padding: "32px 0" }}>
          Select a day to see its planned items.
        </div>
      </GlassCard>
    );
  }

  const entries = getEntriesForDay(day);
  const isToday = day === CALENDAR_MONTH.todayDay;
  const dateObj = new Date(2026, 10, day);
  const weekday = dateObj.toLocaleDateString("en-US", { weekday: "long" });

  return (
    <GlassCard>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>
            {weekday}
            {isToday && (
              <span style={{ marginLeft: 8, color: "var(--accent-blue)", fontWeight: 600 }}>
                · Today
              </span>
            )}
          </div>
          <h3 style={{ fontSize: 22, fontWeight: 700 }}>
            {day} {CALENDAR_MONTH.monthName}
          </h3>
        </div>
        <button
          onClick={onClose}
          style={{
            padding: 4,
            background: "transparent",
            border: "none",
            color: "var(--text-muted)",
            cursor: "pointer",
          }}
          aria-label="Close"
        >
          <IconX size={16} />
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {entries.length === 0 ? (
          <div style={{ fontSize: 13, color: "var(--text-muted)", padding: "16px 0" }}>
            Nothing planned for this day.
          </div>
        ) : (
          entries.map((e) => (
            <Link
              key={e.id}
              href={`/items/${e.item_id}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 12px",
                borderRadius: 10,
                border: "0.5px solid var(--border-glass)",
                background: e.done ? "rgba(0,240,255,0.04)" : "transparent",
                textDecoration: "none",
                color: "var(--text-main)",
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: accentHex(e.item_color),
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{e.item_title}</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                  {e.planned_amount} planned · {e.done ? "done ✓" : "pending"}
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      <GlassButton
        variant="primary"
        icon={<IconPlus size={16} />}
        style={{ marginTop: 16, width: "100%" }}
        onClick={() => alert(`Mock: open "Add plan entry" for ${day} ${CALENDAR_MONTH.monthName}`)}
      >
        Add plan entry
      </GlassButton>
    </GlassCard>
  );
}