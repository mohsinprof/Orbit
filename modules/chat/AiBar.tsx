"use client";

import React, { useRef, useState } from "react";
import { useChatStore, type PendingMention } from "@/stores/useChatStore";
import { mockFolders, mockItems } from "@/lib/mock/data";
import { generateOrbitReply } from "@/lib/mock/orbitResponses";
import MentionChip from "./MentionChip";
import MentionPicker from "./MentionPicker";
import { IconArrowUp, IconAt } from "@tabler/icons-react";

export default function AiBar() {
    const {
        input,
        setInput,
        mentions,
        addMention,
        removeMention,
        clearMentions,
        panelOpen,
        setPanelOpen,
        pickerOpen,
        setPickerOpen,
        addUserMessage,
        addAssistantMessage,
        processing,
        setProcessing,
    } = useChatStore();

    const inputRef = useRef<HTMLInputElement>(null);
    const [pickerQuery, setPickerQuery] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInput(value);

        // Detect @ mention trigger
        const lastAt = value.lastIndexOf("@");
        if (lastAt !== -1) {
            const afterAt = value.slice(lastAt + 1);
            // Open picker if no space yet (still typing the mention)
            if (!afterAt.includes(" ") && afterAt.length <= 20) {
                setPickerQuery(afterAt);
                setPickerOpen(true);
                return;
            }
        }
        setPickerOpen(false);
    };

    const handlePick = (mention: PendingMention) => {
        addMention(mention);
        // Remove the @query from input
        const lastAt = input.lastIndexOf("@");
        if (lastAt !== -1) {
            setInput(input.slice(0, lastAt).trimEnd() + " ");
        }
        setPickerOpen(false);
        inputRef.current?.focus();
    };

    const handleSubmit = () => {
        const text = input.trim();
        if (!text || processing) return;

        const mentionIds = mentions.map((m) => m.id);
        const mentionedItems = mockItems.filter((i) => mentionIds.includes(i.id));
        const mentionedFolders = mockFolders.filter((f) => mentionIds.includes(f.id));

        // Combine input + mention labels for context
        const fullMessage = mentions.length > 0
            ? `${text} ${mentions.map((m) => `(${m.label})`).join(" ")}`
            : text;

        addUserMessage(fullMessage, mentionIds);
        setInput("");
        clearMentions();
        setPickerOpen(false);
        setPanelOpen(true);
        setProcessing(true);

        // Mock Orbit reply with delay
        setTimeout(() => {
            const reply = generateOrbitReply(
                text,
                mentionedItems,
                mentionedFolders,
                mockItems,
                mockFolders,
            );
            addAssistantMessage(reply.content, reply.proposal);
            setProcessing(false);
        }, 600 + Math.random() * 400);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
        if (e.key === "Escape") {
            setPickerOpen(false);
        }
    };

    return (
        <div style={{ position: "relative" }}>
            {pickerOpen && (
                <MentionPicker
                    query={pickerQuery}
                    onPick={handlePick}
                    onClose={() => setPickerOpen(false)}
                />
            )}

            <div
                style={{
                    display: "flex",
                    gap: 8,
                    background: "rgba(0,0,0,0.5)",
                    border: "0.5px solid var(--border-bright)",
                    borderRadius: 16,
                    padding: "10px 14px",
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                    flexDirection: "column",
                    alignItems: "stretch",
                }}
            >
                {mentions.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                        {mentions.map((m) => (
                            <MentionChip key={m.id} mention={m} onRemove={() => removeMention(m.id)} />
                        ))}
                    </div>
                )}

                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        onFocus={() => !panelOpen && setPanelOpen(true)}
                        placeholder="Ask Orbit…"
                        style={{
                            background: "transparent",
                            border: "none",
                            padding: 0,
                            color: "var(--text-main)",
                            fontSize: 14,
                            flex: 1,
                        }}
                    />
                    <button
                        onClick={() => setPickerOpen(true)}
                        style={{
                            padding: 4,
                            background: "transparent",
                            border: "none",
                            color: "var(--text-muted)",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                        }}
                        aria-label="Mention"
                    >
                        <IconAt size={16} />
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!input.trim() || processing}
                        style={{
                            width: 32,
                            height: 32,
                            padding: 0,
                            borderRadius: 10,
                            background:
                                input.trim() && !processing
                                    ? "linear-gradient(135deg, var(--accent-blue), #0072FF)"
                                    : "rgba(255,255,255,0.1)",
                            border: "none",
                            color: "#fff",
                            cursor: input.trim() && !processing ? "pointer" : "default",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            opacity: input.trim() && !processing ? 1 : 0.5,
                        }}
                        aria-label="Send"
                    >
                        <IconArrowUp size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}