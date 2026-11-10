"use client";

import React from "react";
import type { ChatMessage } from "@/lib/types";
import { useChatStore } from "@/stores/useChatStore";
import { accentHex } from "@/lib/colors";
import ProposalCard from "./ProposalCard";

interface Props {
  message: ChatMessage;
}

export default function MessageBubble({ message }: Props) {
  const isUser = message.role === "user";
  const proposals = useChatStore((s) => s.proposals);
  const proposal = message.id ? proposals[message.id] : null;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
      }}
    >
      <div style={{ maxWidth: "85%" }}>
        {!isUser && (
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              marginBottom: 4,
              fontSize: 11,
              color: "var(--accent-blue)",
              fontWeight: 600,
            }}
          >
            <span
              style={{
                width: 14,
                height: 14,
                borderRadius: "50%",
                background: "linear-gradient(135deg, var(--accent-blue), #0072FF)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: 8,
                fontWeight: 700,
              }}
            >
              O
            </span>
            Orbit
          </div>
        )}
        <div
          style={{
            padding: "10px 14px",
            borderRadius: 14,
            background: isUser
              ? "linear-gradient(135deg, var(--accent-red), var(--accent-orange))"
              : "rgba(255,255,255,0.06)",
            border: isUser ? "none" : "0.5px solid var(--border-glass)",
            color: isUser ? "#fff" : "var(--text-main)",
            fontSize: 13,
            lineHeight: 1.5,
          }}
        >
          {message.content}
        </div>

        {proposal && (
          <div style={{ marginTop: 8 }}>
            <ProposalCard proposal={proposal} messageId={message.id} />
          </div>
        )}

        <div
          style={{
            fontSize: 10,
            color: "var(--text-muted)",
            marginTop: 4,
            textAlign: isUser ? "right" : "left",
          }}
        >
          {new Date(message.created_at).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
}