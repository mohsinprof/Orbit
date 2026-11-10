"use client";

import React, { useState } from "react";
import GlassModal from "@/components/glass/GlassModal";
import GlassButton from "@/components/glass/GlassButton";
import { useUiStore } from "@/stores/useUiStore";
import type { AccentColor } from "@/lib/types";

const COLORS: { value: AccentColor; label: string }[] = [
    { value: "blue", label: "Cyan" },
    { value: "orange", label: "Orange" },
    { value: "red", label: "Red" },
    { value: "white", label: "White" },
];

export default function NewFolderModal() {
    const open = useUiStore((s) => s.newFolderModalOpen);
    const close = useUiStore((s) => s.closeNewFolderModal);
    const parentId = useUiStore((s) => s.newFolderParentId);

    const [title, setTitle] = useState("");
    const [color, setColor] = useState<AccentColor>("blue");

    const handleSave = () => {
        alert(`Mock save:\nFolder: ${title || "Untitled"}\nColor: ${color}\nParent: ${parentId ?? "root"}`);
        setTitle("");
        setColor("blue");
        close();
    };

    return (
        <GlassModal open={open} onClose={close} title="Create New Folder" width={440}>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                    <label style={{ fontSize: 12, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>
                        Folder Name
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g., Spring 2027"
                        autoFocus
                    />
                </div>

                <div>
                    <label style={{ fontSize: 12, color: "var(--text-muted)", display: "block", marginBottom: 8 }}>
                        Color
                    </label>
                    <div style={{ display: "flex", gap: 8 }}>
                        {COLORS.map((c) => (
                            <button
                                key={c.value}
                                onClick={() => setColor(c.value)}
                                style={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: 10,
                                    padding: 0,
                                    background: color === c.value ? "rgba(255,255,255,0.08)" : "transparent",
                                    border: color === c.value ? "1px solid var(--accent-blue)" : "0.5px solid var(--border-glass)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                                aria-label={c.label}
                            >
                                <span
                                    style={{
                                        width: 14,
                                        height: 14,
                                        borderRadius: "50%",
                                        background: c.value === "white" ? "#fff" : `var(--accent-${c.value})`,
                                    }}
                                />
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 10 }}>
                <GlassButton onClick={close}>Cancel</GlassButton>
                <GlassButton variant="primary" onClick={handleSave}>
                    Create Folder
                </GlassButton>
            </div>
        </GlassModal>
    );
}
