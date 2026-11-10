"use client";

import React from "react";
import { IconCircleFilled, IconFolder, IconX } from "@tabler/icons-react";
import { accentHex } from "@/lib/colors";
import type { PendingMention } from "@/stores/useChatStore";

interface Props {
    mention: PendingMention;
    onRemove: () => void;
}

export default function MentionChip({ mention, onRemove }: Props) {
    const colorHex = accentHex(mention.type === "folder" ? "blue" : "orange");

    return (
        <span
            style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "4px 8px 4px 6px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.06)",
                border: "0.5px solid var(--border-glass)",
                color: "var(--text-main)",
                fontSize: 11,
                lineHeight: 1,
            }}
        >
            {mention.type === "folder" ? (
                <IconFolder size={10} style={{ color: colorHex }} />
            ) : (
                <IconCircleFilled size={8} style={{ color: colorHex }} />
            )}
            <span>{mention.label}</span>
            <button
                type="button"
                onClick={onRemove}
                aria-label={`Remove ${mention.label}`}
                style={{
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    border: "none",
                    background: "rgba(255,255,255,0.08)",
                    color: "var(--text-muted)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    padding: 0,
                    fontSize: 10,
                    lineHeight: 1,
                }}
            >
                <IconX size={9} />
            </button>
        </span>
    );
}
