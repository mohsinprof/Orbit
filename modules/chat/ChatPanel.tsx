"use client";

import React, { useEffect, useRef } from "react";
import { useChatStore } from "@/stores/useChatStore";
import MessageBubble from "./MessageBubble";
import { IconX, IconSparkles } from "@tabler/icons-react";

export default function ChatPanel() {
  const open = useChatStore((s) => s.panelOpen);
  const messages = useChatStore((s) => s.messages);
  const processing = useChatStore((s) => s.processing);
  const setPanelOpen = useChatStore((s) => s.setPanelOpen);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length, open, processing]);

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: 380,
        maxWidth: "100vw",
        height: "70vh",
        background: "#0B132B",
        border: "0.5px solid var(--border-bright)",
        borderTopRightRadius: 20,
        borderBottom: "none",
        boxShadow: "0 -20px 50px rgba(0,0,0,0.5)",
        zIndex: 200,
        display: "flex",
        flexDirection: "column",
        animation: "slideUp 0.25s ease",
      }}
    >
      <style>{`@keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>

      {/* Header */}
      <div
        style={{
          padding: "12px 16px",
          borderBottom: "0.5px solid var(--border-glass)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: "50%",
              background: "linear-gradient(135deg, var(--accent-blue), #0072FF)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            <IconSparkles size={12} />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Orbit</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
              AI study assistant
            </div>
          </div>
        </div>
        <button
          onClick={() => setPanelOpen(false)}
          style={{
            padding: 0,
            background: "transparent",
            border: "none",
            color: "var(--text-muted)",
            cursor: "pointer",
            fontSize: 18,
            lineHeight: 1,
          }}
          aria-label="Close chat"
        >
          <IconX size={16} />
        </button>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: 16,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {messages.length === 0 ? (
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              color: "var(--text-muted)",
              fontSize: 13,
              gap: 8,
            }}
          >
            <div style={{ fontSize: 32 }}>👋</div>
            <div>Hi, I'm Orbit. Try:</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", fontStyle: "italic" }}>
              "Completed 2 lectures of @Database Systems"
            </div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", fontStyle: "italic" }}>
              "Add a quiz due Friday"
            </div>
          </div>
        ) : (
          messages.map((m) => <MessageBubble key={m.id} message={m} />)
        )}

        {processing && (
          <div style={{ display: "flex", gap: 4, padding: "8px 14px" }}>
            <Dot delay="0ms" />
            <Dot delay="150ms" />
            <Dot delay="300ms" />
          </div>
        )}
      </div>

      {/* Hint footer */}
      <div
        style={{
          padding: "8px 16px",
          borderTop: "0.5px solid var(--border-glass)",
          fontSize: 10,
          color: "var(--text-muted)",
          textAlign: "center",
        }}
      >
        Orbit proposes, you confirm destructive actions.
      </div>
    </div>
  );
}

function Dot({ delay }: { delay: string }) {
  return (
    <span
      style={{
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: "var(--accent-blue)",
        animation: "pulse 1s ease-in-out infinite",
        animationDelay: delay,
        display: "inline-block",
      }}
    >
      <style>{`@keyframes pulse { 0%, 100% { opacity: 0.3; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.1); } }`}</style>
    </span>
  );
}