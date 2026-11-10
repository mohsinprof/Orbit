"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import GlassButton from "@/components/glass/GlassButton";
import { IconPlayerPause, IconPlayerPlay } from "@tabler/icons-react";
import type { Session, Item } from "@/lib/types";

interface Props {
  session: Session;
  item: Item | null;
}

function formatHMS(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);
  return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
}

export default function ActiveTimer({ session, item }: Props) {
  const router = useRouter();
  const [paused, setPaused] = useState<boolean>(!!session.paused_at);
  const [now, setNow] = useState<number>(Date.now());

  // Tick every second
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // Compute elapsed seconds from started_at, paused_at, paused_seconds
  const startMs = new Date(session.started_at).getTime();
  const pauseMs = session.paused_at ? new Date(session.paused_at).getTime() : null;

  const elapsedMs = (pauseMs ?? now) - startMs;
  const elapsedSeconds = Math.max(0, Math.floor(elapsedMs / 1000) - session.paused_seconds);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        flexWrap: "wrap",
        background:
          "linear-gradient(135deg, rgba(0,240,255,0.08), rgba(255,59,48,0.05))",
        borderColor: "rgba(0,240,255,0.3)",
      }}
      className="glass-card"
    >
      <div
        style={{ cursor: item ? "pointer" : "default" }}
        onClick={() => item && router.push(`/items/${item.id}`)}
      >
        <div
          style={{
            fontSize: 12,
            color: "var(--accent-blue)",
            textTransform: "uppercase",
            fontWeight: 600,
            letterSpacing: "0.05em",
            marginBottom: 4,
          }}
        >
          Active Session
        </div>
        <div style={{ fontSize: 18, fontWeight: 600 }}>
          {item ? `${item.title} (Chapter 4 Review)` : "No active session"}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div
          style={{
            fontSize: 24,
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            fontWeight: 600,
            color: "var(--text-main)",
          }}
        >
          {formatHMS(elapsedSeconds)}
        </div>
        <GlassButton
          onClick={() => setPaused((p) => !p)}
          style={{ background: "rgba(255,255,255,0.1)" }}
          icon={paused ? <IconPlayerPlay size={16} /> : <IconPlayerPause size={16} />}
        >
          {paused ? "Resume" : "Pause"}
        </GlassButton>
      </div>
    </div>
  );
}
