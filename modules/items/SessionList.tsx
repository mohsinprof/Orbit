import React from "react";
import type { Session } from "@/lib/types";
import EmptyState from "@/components/shared/EmptyState";

interface Props {
    sessions: Session[];
}

function formatDuration(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
}

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export default function SessionList({ sessions }: Props) {
    if (sessions.length === 0) {
        return <EmptyState title="No sessions yet" hint="Start a timer to track focused work." />;
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {sessions.map((s) => {
                const isOpen = !s.ended_at;
                const start = new Date(s.started_at).getTime();
                const end = s.ended_at ? new Date(s.ended_at).getTime() : Date.now();
                const elapsed = Math.floor((end - start) / 1000) - s.paused_seconds;
                return (
                    <div
                        key={s.id}
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "10px 12px",
                            borderRadius: 10,
                            border: "0.5px solid var(--border-glass)",
                            background: isOpen ? "rgba(0,240,255,0.04)" : "transparent",
                        }}
                    >
                        <div>
                            <div style={{ fontSize: 13, fontWeight: 500 }}>
                                {formatDate(s.started_at)}
                                {isOpen && (
                                    <span style={{ marginLeft: 8, fontSize: 11, color: "var(--accent-blue)", fontWeight: 600 }}>
                                        · LIVE
                                    </span>
                                )}
                            </div>
                            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                                {s.paused_seconds > 0 ? `Paused ${Math.round(s.paused_seconds / 60)}m · ` : ""}
                                {isOpen ? "in progress" : `ended ${formatDate(s.ended_at!)}`}
                            </div>
                        </div>
                        <div style={{ fontSize: 14, fontWeight: 600, fontFamily: "ui-monospace, monospace", color: isOpen ? "var(--accent-blue)" : "var(--text-main)" }}>
                            {formatDuration(elapsed)}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
