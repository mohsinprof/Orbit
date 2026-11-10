"use client";

import React, { useState } from "react";

interface Props {
    aliases: string[];
}

export default function AliasChips({ aliases }: Props) {
    const [list, setList] = useState<string[]>(aliases);
    const [adding, setAdding] = useState(false);
    const [value, setValue] = useState("");

    const addAlias = () => {
        const v = value.trim();
        if (v && !list.includes(v)) setList([...list, v]);
        setValue("");
        setAdding(false);
    };

    return (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
            {list.map((alias) => (
                <span
                    key={alias}
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "4px 10px",
                        background: "rgba(255,255,255,0.06)",
                        border: "0.5px solid var(--border-glass)",
                        borderRadius: 12,
                        fontSize: 12,
                        color: "var(--text-muted)",
                    }}
                >
                    {alias}
                    <button
                        onClick={() => setList(list.filter((a) => a !== alias))}
                        style={{ padding: 0, background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: 14, lineHeight: 1 }}
                        aria-label={`Remove ${alias}`}
                    >
                        ×
                    </button>
                </span>
            ))}
            {adding ? (
                <input
                    type="text"
                    autoFocus
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onBlur={addAlias}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") addAlias();
                        if (e.key === "Escape") {
                            setValue("");
                            setAdding(false);
                        }
                    }}
                    placeholder="Add alias…"
                    style={{ width: 120, padding: "4px 10px", fontSize: 12 }}
                />
            ) : (
                <button
                    onClick={() => setAdding(true)}
                    style={{ padding: "4px 10px", fontSize: 12, background: "transparent", border: "0.5px dashed var(--border-bright)" }}
                >
                    + Add alias
                </button>
            )}
        </div>
    );
}
