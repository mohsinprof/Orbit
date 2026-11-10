"use client";

import React from "react";
import type { Item } from "@/lib/types";
import { layoutOrbit } from "@/lib/orbitLayout";
import OrbitCenter from "./OrbitCenter";
import OrbitNode from "./OrbitNode";
import OrbitThreads from "./OrbitThreads";
import { useRouter } from "next/navigation";

interface Props {
  items: Item[];
  dateLabel: string;
  todayLogged: number;
  pace: number;
}

// Stage-space (720x580) — used to position SVG thread endpoints
const STAGE_W = 720;
const STAGE_H = 580;

export default function OrbitStage({ items, dateLabel, todayLogged, pace }: Props) {
  const router = useRouter();
  const placements = layoutOrbit(items);

  // Compute thread endpoint in stage-space for each placement
  const threads = placements.map((p) => {
    const cx = p.slot.x + p.slot.width / 2;
    const cy = p.slot.y + 30; // approximate vertical center of node
    return {
      x: (cx / 100) * STAGE_W,
      y: (cy / 100) * STAGE_H,
    };
  });

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 720,
        height: 580,
        margin: "0 auto",
        background: "rgba(5, 11, 22, 0.6)",
        borderRadius: 24,
        border: "0.5px solid var(--border-glass)",
        overflow: "hidden",
        boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
      }}
    >
      <OrbitThreads threads={threads} />
      <OrbitCenter dateLabel={dateLabel} />

      {placements.map((p) => (
        <div
          key={p.item.id}
          style={
            {
              "--x": `${p.slot.x}%`,
              "--y": `${p.slot.y}%`,
              "--w": `${p.slot.width}%`,
            } as React.CSSProperties
          }
        >
          <OrbitNode
            item={p.item}
            todayLogged={todayLogged}
            pace={pace}
            onClick={() => router.push(`/items/${p.item.id}`)}
          />
        </div>
      ))}
    </div>
  );
}