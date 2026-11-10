import React from "react";

interface Props {
  title: string;
  hint?: string;
  action?: React.ReactNode;
}

export default function EmptyState({ title, hint, action }: Props) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 24px",
        textAlign: "center",
        gap: 12,
      }}
    >
      <div style={{ fontSize: 15, fontWeight: 600 }}>{title}</div>
      {hint && <div style={{ fontSize: 13, color: "var(--text-muted)", maxWidth: 360 }}>{hint}</div>}
      {action}
    </div>
  );
}
