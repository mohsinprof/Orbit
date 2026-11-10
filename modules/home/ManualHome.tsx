"use client";

import React, { useEffect, useMemo, useState } from "react";
import OrbStage from "@/modules/orbit/OrbStage";
import TaskCard from "@/modules/items/TaskCard";
import GlassCard from "@/components/glass/GlassCard";
import { mockItems, mockSessions } from "@/lib/mock/data";

function formatHMS(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);
  return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
}

export default function ManualHome() {
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [now, setNow] = useState<number>(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const items = mockItems.filter((i) => !i.archived_at && i.status !== "done");
  const activeItem = items.find((i) => i.id === activeItemId) ?? null;
  const activeSession = mockSessions[0];

  const timerDisplay = useMemo(() => {
    if (!activeSession || !activeItem) return undefined;
    const startMs = new Date(activeSession.started_at).getTime();
    const elapsed = Math.floor((now - startMs) / 1000) - activeSession.paused_seconds;
    return formatHMS(Math.max(0, elapsed));
  }, [activeSession, activeItem, now]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>Today</h1>
        <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>
          Manual mode · no AI
        </p>
      </div>

      {/* Timer orb (pure widget) */}
      <OrbStage
        activeItemTitle={activeItem?.title}
        timerDisplay={timerDisplay}
        chatActive={false}
        onOrbClick={() => setActiveItemId(null)}
      />

      {/* Flat task list */}
      <GlassCard>
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: "var(--text-muted)" }}>
          Active Tasks ({items.length})
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {items.map((item) => (
            <TaskCard
              key={item.id}
              item={item}
              flat
              isActive={item.id === activeItemId}
              onStart={() => setActiveItemId(item.id)}
              onPause={() => setActiveItemId(null)}
            />
          ))}
        </div>
      </GlassCard>
    </div>
  );
}