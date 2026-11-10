"use client";

import React, { useState } from "react";
import GlassCard from "@/components/glass/GlassCard";
import GlassButton from "@/components/glass/GlassButton";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import MonthGrid from "./MonthGrid";
import DayDetailPanel from "./DayDetailPanel";
import { CALENDAR_MONTH } from "@/lib/mock/calendar";

export default function CalendarClient() {
  const [selectedDay, setSelectedDay] = useState<number | null>(CALENDAR_MONTH.todayDay);

  return (
    <>
      <GlassCard>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 600 }}>
              {CALENDAR_MONTH.monthName} {CALENDAR_MONTH.year} Planner
            </h3>
            <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>
              Click a day to see planned items
            </p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <GlassButton
              onClick={() => alert("Previous month — wired in Phase B")}
              icon={<IconChevronLeft size={16} />}
            >
              Prev
            </GlassButton>
            <GlassButton
              onClick={() => alert("Next month — wired in Phase B")}
            >
              Next
              <IconChevronRight size={16} style={{ marginLeft: 6, display: "inline-flex", verticalAlign: "middle" }} />
            </GlassButton>
          </div>
        </div>

        <MonthGrid selectedDay={selectedDay} onSelectDay={setSelectedDay} />
      </GlassCard>

      <DayDetailPanel day={selectedDay} onClose={() => setSelectedDay(null)} />
    </>
  );
}