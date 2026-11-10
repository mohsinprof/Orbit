"use client";

import React from "react";
import Link from "next/link";
import { useNotificationsStore } from "@/stores/useNotificationsStore";
import { accentHex } from "@/lib/colors";
import type { Notification } from "@/lib/types";
import GlassButton from "@/components/glass/GlassButton";
import { IconCheck, IconClock, IconAlertTriangle, IconCircleCheck, IconBell } from "@tabler/icons-react";

const ICON_MAP: Record<Notification["type"], { icon: typeof IconClock; color: "red" | "orange" | "blue" | "white" }> = {
  deadline_soon: { icon: IconClock, color: "orange" },
  behind_schedule: { icon: IconAlertTriangle, color: "red" },
  daily_goal_met: { icon: IconCircleCheck, color: "blue" },
  proposal_waiting: { icon: IconBell, color: "white" },
};

function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  return `${day}d ago`;
}

export default function NotificationList() {
  const { notifications, markRead, markAllRead } = useNotificationsStore();
  const unread = notifications.filter((n) => !n.read_at);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {notifications.length === 0 ? (
        <div style={{ padding: "32px 0", textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>
          No notifications
        </div>
      ) : (
        notifications.map((n) => {
          const meta = ICON_MAP[n.type];
          const Icon = meta.icon;
          const colorHex = accentHex(meta.color);
          const isUnread = !n.read_at;

          return (
            <div
              key={n.id}
              style={{
                display: "flex",
                gap: 10,
                padding: "12px 14px",
                borderRadius: 10,
                border: isUnread
                  ? "0.5px solid rgba(0,240,255,0.2)"
                  : "0.5px solid var(--border-glass)",
                background: isUnread ? "rgba(0,240,255,0.04)" : "transparent",
                opacity: isUnread ? 1 : 0.6,
                cursor: n.item_id ? "pointer" : "default",
              }}
              onClick={() => {
                if (!isUnread) return;
                markRead(n.id);
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  background: `${colorHex}20`,
                  border: `0.5px solid ${colorHex}40`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Icon size={14} style={{ color: colorHex }} />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-main)" }}>
                    {n.title}
                  </div>
                  <div style={{ fontSize: 10, color: "var(--text-muted)", flexShrink: 0 }}>
                    {formatRelative(n.scheduled_for)}
                  </div>
                </div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 3, lineHeight: 1.5 }}>
                  {n.body}
                </div>
                {n.item_id && (
                  <Link
                    href={`/items/${n.item_id}`}
                    style={{
                      display: "inline-block",
                      marginTop: 6,
                      fontSize: 11,
                      color: "var(--accent-blue)",
                      textDecoration: "none",
                      fontWeight: 600,
                    }}
                  >
                    View item →
                  </Link>
                )}
              </div>
            </div>
          );
        })
      )}

      {unread.length > 0 && (
        <GlassButton
          onClick={markAllRead}
          icon={<IconCheck size={14} />}
          style={{ marginTop: 8, alignSelf: "flex-end", padding: "8px 14px" }}
        >
          Mark all read
        </GlassButton>
      )}
    </div>
  );
}