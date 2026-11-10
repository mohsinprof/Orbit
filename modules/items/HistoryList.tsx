import React from "react";
import EmptyState from "@/components/shared/EmptyState";

interface ChangeEntry {
    id: string;
    source: "ai" | "manual";
    action_type: string;
    payload: Record<string, unknown>;
    previous_state: Record<string, unknown> | null;
    message_id: string | null;
    undone: boolean;
    created_at: string;
}

interface Props {
    changes: ChangeEntry[];
}

function formatAction(action_type: string): string {
    return action_type
        .split("_")
        .map((w) => w[0].toUpperCase() + w.slice(1))
        .join(" ");
}

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export default function HistoryList({ changes }: Props) {
    if (changes.length === 0) {
        return <EmptyState title="No history yet" hint="Changes to this item will appear here." />;
    }

    const sorted = [...changes].sort((a, b) => b.created_at.localeCompare(a.created_at));

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {sorted.map((c) => (
                <div
                    key={c.id}
                    style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 10,
                        padding: "10px 12px",
                        borderRadius: 10,
                        border: "0.5px solid var(--border-glass)",
                        opacity: c.undone ? 0.5 : 1,
                    }}
                >
                    <div
                        style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: c.source === "ai" ? "var(--accent-blue)" : "var(--accent-orange)",
                            marginTop: 6,
                            flexShrink: 0,
                        }}
                    />
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 500 }}>
                            {formatAction(c.action_type)}
                            {c.undone && <span style={{ marginLeft: 6, fontSize: 11, color: "var(--accent-orange)" }}>(undone)</span>}
                        </div>
                        <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                            by {c.source === "ai" ? "Orbit AI" : "you"} · {formatDate(c.created_at)}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
