"use client";

import React from "react";
import { useRouter } from "next/navigation";
import type { Item } from "@/lib/types";
import { accentHex } from "@/lib/colors";
import { percentDone, computeStatus } from "@/lib/status";
import ProgressBar from "@/components/glass/ProgressBar";

interface Props {
  item: Item;
  todayLogged: number;
  pace: number;
}

export default function TaskCard({ item, todayLogged, pace }: Props) {
  const router = useRouter();
  const pct = percentDone(item);
  const status = computeStatus(item, pace, todayLogged);
  const colorHex = accentHex(item.color);

  return (
    <div
      onClick={() => router.push(`/items/${item.id}`)}
      className="glass-card"
      style={{ cursor: "pointer" }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8,
        }}
      >
        <span style={{ fontSize: 12, fontWeight: 600, color: colorHex }}>
          {status.label}
        </span>
        <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{pct}%</span>
      </div>
      <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>{item.title}</div>
      <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 12 }}>
        {item.done_units} / {item.total_units} {item.unit}
      </div>
      <ProgressBar value={pct} color={item.color} height={6} />
    </div>
  );
}
