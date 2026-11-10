import React from "react";
import GlassCard from "@/components/glass/GlassCard";
import GlassButton from "@/components/glass/GlassButton";
import { IconBulb, IconPlus } from "@tabler/icons-react";

interface Props {
  onAddTask?: () => void;
}

export default function EmptyDashboard({ onAddTask }: Props) {
  return (
    <GlassCard
      glow="blue"
      style={{
        padding: "48px 32px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 16,
          background: "rgba(0,240,255,0.1)",
          border: "0.5px solid rgba(0,240,255,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <IconBulb size={28} style={{ color: "var(--accent-blue)" }} />
      </div>

      <div>
        <h3 style={{ fontSize: 18, fontWeight: 600 }}>Welcome to Done</h3>
        <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 6, maxWidth: 360 }}>
          Create your first task and Orbit will help you track progress, plan your days,
          and stay on pace.
        </p>
      </div>

      <GlassButton
        variant="primary"
        icon={<IconPlus size={16} />}
        onClick={onAddTask}
      >
        Create your first task
      </GlassButton>
    </GlassCard>
  );
}