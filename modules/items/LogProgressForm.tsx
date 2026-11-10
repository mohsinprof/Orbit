"use client";

import React, { useState } from "react";
import GlassButton from "@/components/glass/GlassButton";
import type { Item } from "@/lib/types";

interface Props {
    item: Item;
}

export default function LogProgressForm({ item }: Props) {
    const [amount, setAmount] = useState("");
    const [note, setNote] = useState("");
    const [justLogged, setJustLogged] = useState<number | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const n = parseFloat(amount);
        if (isNaN(n) || n <= 0) return;
        setJustLogged(n);
        setTimeout(() => setJustLogged(null), 3000);
        setAmount("");
        setNote("");
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
                <label style={{ fontSize: 12, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>
                    Amount ({item.unit})
                </label>
                <input
                    type="number"
                    step="0.1"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder={`e.g., 1.5 ${item.unit}`}
                    required
                />
            </div>
            <div>
                <label style={{ fontSize: 12, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>
                    Note (optional)
                </label>
                <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="What did you work on?"
                />
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <GlassButton type="submit" variant="primary">Log progress</GlassButton>
                {justLogged !== null && (
                    <span style={{ fontSize: 12, color: "var(--accent-blue)" }}>✓ Logged {justLogged} {item.unit}</span>
                )}
            </div>
        </form>
    );
}
