"use client";

import React from "react";
import { accentHex } from "@/lib/colors";
import { CALENDAR_MONTH, LEADING_EMPTIES, getEntriesForDay } from "@/lib/mock/calendar";

interface Props {
  selectedDay: number | null;
  onSelectDay: (day: number) => void;
}

const WEEKDAY_HEADERS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function MonthGrid({ selectedDay, onSelectDay }: Props) {
  const cells: (number | null)[] = [
    ...Array(LEADING_EMPTIES).fill(null),
    ...Array.from({ length: CALENDAR_MONTH.totalDays }, (_, i) => i + 1),
  ];

  // Pad to multiple of 7
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 8,
          textAlign: "center",
          fontSize: 12,
          color: "var(--text-muted)",
          marginBottom: 8,
        }}
      >
        {WEEKDAY_HEADERS.map((d) => (
          <span key={d} style={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            {d}
          </span>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 8,
        }}
      >
        {cells.map((day, idx) => {
          if (day === null) {
            return <div key={`empty-${idx}`} style={{ minHeight: 88 }} />;
          }

          const isToday = day === CALENDAR_MONTH.todayDay;
          const isSelected = day === selectedDay;
          const entries = getEntriesForDay(day);
          const hasEntries = entries.length > 0;
          const allDone = entries.length > 0 && entries.every((e) => e.done);

          return (
            <button
              key={day}
              onClick={() => onSelectDay(day)}
              style={{
                background: isSelected
                  ? "rgba(0,240,255,0.08)"
                  : "rgba(255,255,255,0.02)",
                border: isSelected
                  ? "0.5px solid var(--accent-blue)"
                  : "0.5px solid var(--border-glass)",
                borderRadius: 10,
                minHeight: 88,
                padding: 8,
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "flex-start",
                textAlign: "left",
                transition: "all 0.15s",
                opacity: allDone ? 0.6 : 1,
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.05)";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-bright)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.02)";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-glass)";
                }
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  color: isToday ? "var(--accent-blue)" : "var(--text-muted)",
                  fontWeight: isToday ? 700 : 400,
                }}
              >
                {day}
              </span>

              {hasEntries && (
                <div style={{ display: "flex", flexDirection: "column", gap: 3, width: "100%" }}>
                  {entries.slice(0, 2).map((e) => (
                    <div
                      key={e.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        fontSize: 10,
                        color: "var(--text-muted)",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                      }}
                    >
                      <span
                        style={{
                          width: 5,
                          height: 5,
                          borderRadius: "50%",
                          background: accentHex(e.item_color),
                          flexShrink: 0,
                        }}
                      />
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                        {e.item_title}
                      </span>
                    </div>
                  ))}
                  {entries.length > 2 && (
                    <span style={{ fontSize: 10, color: "var(--text-muted)" }}>
                      +{entries.length - 2} more
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}