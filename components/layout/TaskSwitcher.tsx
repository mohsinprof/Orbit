"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  IconList,
  IconChevronDown,
  IconPlus,
  IconPlayerPlay,
  IconPlayerPause,
  IconFolder,
  IconCircleFilled,
  IconLock,
  IconAlertTriangle,
} from "@tabler/icons-react";
import { mockItems, mockFolders } from "@/lib/mock/data";
import { accentHex } from "@/lib/colors";
import { useUiStore } from "@/stores/useUiStore";
import { useModeStore } from "@/stores/useModeStore";

export default function TaskSwitcher() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const openAddTaskModal = useUiStore((s) => s.openAddTaskModal);
  const mode = useModeStore((s) => s.mode);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  // Group items by folder
  const groupedByFolder = mockFolders.map((folder) => ({
    folder,
    items: mockItems.filter((i) => i.folder_id === folder.id && !i.archived_at),
  }));
  const noFolder = mockItems.filter((i) => !i.folder_id && !i.archived_at);

  const activeItem = mockItems.find((i) => i.id === "item-1"); // mock: DB Systems is active

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 14px",
          borderRadius: 10,
          background: "rgba(255,255,255,0.04)",
          border: "0.5px solid var(--border-glass)",
          color: "var(--text-main)",
          fontSize: 13,
          fontWeight: 500,
          cursor: "pointer",
          minWidth: 120,
          transition: "all 0.15s",
        }}
      >
        <IconList size={16} />
        <span>Tasks</span>
        <IconChevronDown
          size={14}
          style={{
            transition: "transform 0.15s",
            transform: open ? "rotate(180deg)" : "rotate(0)",
          }}
        />
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            width: 360,
            maxHeight: "70vh",
            overflowY: "auto",
            background: "#0B132B",
            border: "0.5px solid var(--border-bright)",
            borderRadius: 16,
            boxShadow: "0 12px 32px rgba(0,0,0,0.5)",
            zIndex: 200,
            padding: 8,
            animation: "fadeIn 0.15s ease",
          }}
        >
          <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }`}</style>

          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px 12px 12px",
              borderBottom: "0.5px solid var(--border-glass)",
              marginBottom: 8,
            }}
          >
            <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              All Tasks · {mockItems.length}
            </span>
            <button
              onClick={() => {
                openAddTaskModal();
                setOpen(false);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                padding: "4px 10px",
                background: "rgba(0,240,255,0.1)",
                border: "0.5px solid rgba(0,240,255,0.3)",
                borderRadius: 8,
                color: "var(--accent-blue)",
                fontSize: 11,
                fontWeight: 600,
              }}
            >
              <IconPlus size={12} /> New Task
            </button>
          </div>

          {/* Tasks grouped by folder */}
          {groupedByFolder.map(({ folder, items }) => (
            <div key={folder.id} style={{ marginBottom: 4 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "4px 12px",
                  fontSize: 11,
                  color: "var(--text-muted)",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                <IconFolder size={12} style={{ color: accentHex(folder.color) }} />
                {folder.title}
                {folder.locked && <IconLock size={10} style={{ color: "var(--accent-orange)" }} />}
                <span style={{ marginLeft: "auto", opacity: 0.6 }}>{items.length}</span>
              </div>
              {items.map((item) => (
                <TaskRow
                  key={item.id}
                  item={item}
                  active={activeItem?.id === item.id}
                />
              ))}
            </div>
          ))}

          {noFolder.length > 0 && (
            <div style={{ marginBottom: 4 }}>
              <div
                style={{
                  padding: "4px 12px",
                  fontSize: 11,
                  color: "var(--text-muted)",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                No Folder
              </div>
              {noFolder.map((item) => (
                <TaskRow key={item.id} item={item} active={activeItem?.id === item.id} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function TaskRow({
  item,
  active,
}: {
  item: typeof mockItems[number];
  active: boolean;
}) {
  const colorHex = accentHex(item.color);
  const isRunning = active && !item.archived_at;
  const behindSchedule =
    item.roll_over_hours > 2 ||
    (typeof window !== "undefined" &&
      !!item.due_date &&
      new Date(item.due_date) < new Date() &&
      item.status !== "done");

  return (
    <Link
      href={`/items/${item.id}`}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "8px 12px",
        borderRadius: 8,
        textDecoration: "none",
        color: "var(--text-main)",
        transition: "background 0.1s",
        border: isRunning ? "0.5px solid rgba(0,240,255,0.25)" : "0.5px solid transparent",
        background: isRunning ? "rgba(0,240,255,0.04)" : "transparent",
      }}
      onMouseEnter={(e) => {
        if (!isRunning) (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.04)";
      }}
      onMouseLeave={(e) => {
        if (!isRunning) (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
      }}
    >
      <IconCircleFilled size={8} style={{ color: colorHex, flexShrink: 0 }} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 13, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {item.title}
          </span>
          {behindSchedule && (
            <IconAlertTriangle size={11} style={{ color: "var(--accent-orange)", flexShrink: 0 }} />
          )}
        </div>
        <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
          {item.done_units} / {item.total_goal} {item.unit}
          {item.roll_over_hours > 0 && (
            <span style={{ marginLeft: 6, color: "var(--accent-orange)" }}>
              · +{item.roll_over_hours}h roll-over
            </span>
          )}
        </div>
      </div>

      {/* Start/Pause button — stops link navigation */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          alert(isRunning ? `Pause ${item.title}` : `Start ${item.title}`);
        }}
        aria-label={isRunning ? "Pause timer" : "Start timer"}
        style={{
          width: 28,
          height: 28,
          borderRadius: 8,
          padding: 0,
          background: isRunning ? "rgba(255,149,0,0.15)" : "rgba(0,240,255,0.1)",
          border: isRunning
            ? "0.5px solid rgba(255,149,0,0.4)"
            : "0.5px solid rgba(0,240,255,0.3)",
          color: isRunning ? "var(--accent-orange)" : "var(--accent-blue)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          cursor: "pointer",
        }}
      >
        {isRunning ? <IconPlayerPause size={12} /> : <IconPlayerPlay size={12} />}
      </button>
    </Link>
  );
}