"use client";

import React, { useMemo, useState } from "react";
import Fuse from "fuse.js";
import { mockFolders, mockItems } from "@/lib/mock/data";
import { accentHex } from "@/lib/colors";
import type { AccentColor } from "@/lib/types";
import { IconFolder, IconCircleFilled } from "@tabler/icons-react";
import type { PendingMention } from "@/stores/useChatStore";

interface Props {
  query: string; // text typed after @
  onPick: (mention: PendingMention) => void;
  onClose: () => void;
}

interface Mentionable {
  id: string;
  type: "folder" | "item";
  label: string;
  color: AccentColor;
}

export default function MentionPicker({ query, onPick, onClose }: Props) {
  const allMentionables: Mentionable[] = useMemo(
    () => [
      ...mockFolders
        .filter((f) => !f.archived_at)
        .map((f) => ({
          id: f.id,
          type: "folder" as const,
          label: f.title,
          color: f.color,
        })),
      ...mockItems
        .filter((i) => !i.archived_at)
        .map((i) => ({
          id: i.id,
          type: "item" as const,
          label: i.title,
          color: i.color,
        })),
    ],
    [],
  );

  const fuse = useMemo(
    () =>
      new Fuse(allMentionables, {
        keys: ["label"],
        threshold: 0.4,
        includeScore: true,
      }),
    [allMentionables],
  );

  const results = query
    ? fuse.search(query).slice(0, 6).map((r) => r.item)
    : allMentionables.slice(0, 6);

  return (
    <div
      style={{
        position: "absolute",
        bottom: "100%",
        left: 0,
        right: 0,
        marginBottom: 8,
        background: "#0B132B",
        border: "0.5px solid var(--border-bright)",
        borderRadius: 12,
        padding: 6,
        boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
        zIndex: 50,
        maxHeight: 240,
        overflowY: "auto",
      }}
    >
      <div
        style={{
          fontSize: 10,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          color: "var(--text-muted)",
          padding: "6px 10px",
          fontWeight: 600,
        }}
      >
        Mention {query ? `· "${query}"` : ""}
      </div>
      {results.length === 0 ? (
        <div
          style={{
            padding: "8px 10px",
            fontSize: 12,
            color: "var(--text-muted)",
          }}
        >
          No matches
        </div>
      ) : (
        results.map((r) => {
          const colorHex = accentHex(r.color);
          return (
            <button
              key={`${r.type}-${r.id}`}
              onClick={() => {
                onPick(r);
                onClose();
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                width: "100%",
                padding: "8px 10px",
                background: "transparent",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
                textAlign: "left",
                fontSize: 13,
                color: "var(--text-main)",
                transition: "background 0.1s",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.06)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "transparent")}
            >
              {r.type === "folder" ? (
                <IconFolder size={14} style={{ color: colorHex }} />
              ) : (
                <IconCircleFilled size={8} style={{ color: colorHex }} />
              )}
              <span style={{ flex: 1 }}>{r.label}</span>
              <span style={{ fontSize: 10, color: "var(--text-muted)" }}>
                {r.type}
              </span>
            </button>
          );
        })
      )}
    </div>
  );
}