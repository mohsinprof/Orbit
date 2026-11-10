"use client";

import React, { useState } from "react";
import { IconCheck, IconPlus, IconX } from "@tabler/icons-react";
import type { Chapter } from "@/lib/types";

interface Props {
  chapters: Chapter[];
}

export default function ChapterList({ chapters: initial }: Props) {
  const [chapters, setChapters] = useState<Chapter[]>(initial);
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");

  const addChapter = () => {
    const v = title.trim();
    if (!v) {
      setAdding(false);
      return;
    }
    setChapters([...chapters, { id: `ch-${Date.now()}`, title: v, done: false }]);
    setTitle("");
    setAdding(false);
  };

  const toggle = (id: string) => {
    setChapters(chapters.map((c) => (c.id === id ? { ...c, done: !c.done } : c)));
  };

  const remove = (id: string) => {
    setChapters(chapters.filter((c) => c.id !== id));
  };

  const completed = chapters.filter((c) => c.done).length;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
          {completed} of {chapters.length} done
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {chapters.map((c) => (
          <div
            key={c.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 12px",
              borderRadius: 8,
              border: "0.5px solid var(--border-glass)",
              background: c.done ? "rgba(0,240,255,0.04)" : "transparent",
            }}
          >
            <button
              onClick={() => toggle(c.id)}
              style={{
                width: 18,
                height: 18,
                borderRadius: "50%",
                border: c.done ? "none" : "1px solid var(--border-bright)",
                background: c.done ? "var(--accent-blue)" : "transparent",
                color: "#fff",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 0,
              }}
            >
              {c.done && <IconCheck size={11} />}
            </button>
            <span style={{ flex: 1, fontSize: 13, textDecoration: c.done ? "line-through" : "none", opacity: c.done ? 0.6 : 1 }}>
              {c.title}
            </span>
            <button
              onClick={() => remove(c.id)}
              style={{ padding: 0, background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
              aria-label="Remove chapter"
            >
              <IconX size={12} />
            </button>
          </div>
        ))}

        {adding ? (
          <input
            type="text"
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={addChapter}
            onKeyDown={(e) => {
              if (e.key === "Enter") addChapter();
              if (e.key === "Escape") { setTitle(""); setAdding(false); }
            }}
            placeholder="Chapter title…"
            style={{ padding: "8px 12px" }}
          />
        ) : (
          <button
            onClick={() => setAdding(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 12px",
              background: "transparent",
              border: "0.5px dashed var(--border-bright)",
              borderRadius: 8,
              color: "var(--accent-blue)",
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            <IconPlus size={12} /> Add Chapter
          </button>
        )}
      </div>
    </div>
  );
}