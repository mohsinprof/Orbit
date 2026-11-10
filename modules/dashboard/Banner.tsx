"use client";

import React from "react";
import GlassButton from "@/components/glass/GlassButton";
import { useUiStore } from "@/stores/useUiStore";

export default function Banner() {
  const openAddTaskModal = useUiStore((s) => s.openAddTaskModal);

  return (
    <div
      style={{
        background:
          "linear-gradient(135deg, rgba(255,59,48,0.15), rgba(255,149,0,0.15))",
        border: "0.5px solid rgba(255,149,0,0.3)",
        padding: "14px 20px",
        borderRadius: 14,
        fontSize: 13,
        color: "var(--text-muted)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        flexWrap: "wrap",
      }}
    >
      <span>
        💡 Future tasks and scheduled milestones can be planned and managed directly from the
        Calendar tab.
      </span>
      <GlassButton variant="primary" onClick={openAddTaskModal} style={{ padding: "6px 14px" }}>
        + New Task
      </GlassButton>
    </div>
  );
}