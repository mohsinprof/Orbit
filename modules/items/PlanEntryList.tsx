import React from "react";
import type { PlanEntry } from "@/lib/types";
import EmptyState from "@/components/shared/EmptyState";

interface Props {
    entries: PlanEntry[];
}

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short" });
}

export default function PlanEntryList({ entries }: Props) {
    if (entries.length === 0) {
        return <EmptyState title="Nothing planned" hint="Plan entries appear when you schedule this item." />;
    }

    const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {sorted.map((entry) => (
                <div
                    key={entry.id}
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "8px 12px",
                        borderRadius: 8,
                        border: "0.5px solid var(--border-glass)",
                        background: entry.done ? "rgba(0,240,255,0.04)" : "transparent",
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div
                            style={{
                                width: 18,
                                height: 18,
                                borderRadius: "50%",
                                border: entry.done ? "none" : "1px solid var(--border-bright)",
                                background: entry.done ? "var(--accent-blue)" : "transparent",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#fff",
                                fontSize: 11,
                                fontWeight: 700,
                            }}
                        >
                            {entry.done ? "✓" : ""}
                        </div>
                        <span style={{ fontSize: 13 }}>{formatDate(entry.date)}</span>
                    </div>
                    <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                        {entry.planned_amount} {entry.done ? "done" : "planned"}
                    </span>
                </div>
            ))}
        </div>
    );
}
