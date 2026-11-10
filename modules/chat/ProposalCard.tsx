"use client";

import React from "react";
import GlassButton from "@/components/glass/GlassButton";
import { useChatStore } from "@/stores/useChatStore";
import { applyProposal, type OrbitProposal } from "@/lib/mock/orbitResponses";
import { IconCheck, IconX, IconAlertTriangle } from "@tabler/icons-react";
import { accentHex } from "@/lib/colors";

interface Props {
  proposal: OrbitProposal;
  messageId: string;
}

export default function ProposalCard({ proposal, messageId }: Props) {
  const apply = useChatStore((s) => s.applyProposal);
  const cancel = useChatStore((s) => s.cancelProposal);

  const isPending = proposal.status === "pending";
  const isApplied = proposal.status === "applied";
  const isCancelled = proposal.status === "cancelled";

  return (
    <div
      style={{
        background: "rgba(0,240,255,0.04)",
        border: "0.5px solid rgba(0,240,255,0.25)",
        borderRadius: 12,
        padding: 12,
        opacity: isCancelled ? 0.5 : 1,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          marginBottom: 8,
        }}
      >
        <IconAlertTriangle
          size={12}
          style={{ color: isPending ? "var(--accent-orange)" : "var(--accent-blue)" }}
        />
        <span
          style={{
            fontSize: 10,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            color: isPending ? "var(--accent-orange)" : "var(--accent-blue)",
            fontWeight: 600,
          }}
        >
          {isPending ? "Proposal · needs confirmation" : isApplied ? "Applied" : "Cancelled"}
        </span>
      </div>

      <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 10 }}>
        {proposal.summary}
      </div>

      {/* Action chips */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 10 }}>
        {proposal.actions.map((a, idx) => (
          <span
            key={idx}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              padding: "3px 8px",
              background: "rgba(0,0,0,0.3)",
              border: "0.5px solid var(--border-glass)",
              borderRadius: 8,
              fontSize: 11,
              color: "var(--text-muted)",
              fontFamily: "ui-monospace, monospace",
            }}
          >
            {a.type}
          </span>
        ))}
      </div>

      {/* Buttons */}
      {isPending && (
        <div style={{ display: "flex", gap: 8 }}>
          <GlassButton
            variant="primary"
            icon={<IconCheck size={14} />}
            onClick={() => {
              const result = applyProposal(proposal);
              apply(proposal.id, messageId);
              alert(result); // mock — Phase B will refresh UI from DB
            }}
            style={{ padding: "6px 12px", fontSize: 12 }}
          >
            Apply
          </GlassButton>
          <GlassButton
            onClick={() => cancel(proposal.id, messageId)}
            icon={<IconX size={14} />}
            style={{ padding: "6px 12px", fontSize: 12 }}
          >
            Cancel
          </GlassButton>
        </div>
      )}

      {isApplied && (
        <div
          style={{
            fontSize: 11,
            color: "var(--accent-blue)",
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <IconCheck size={12} /> Applied successfully
        </div>
      )}

      {isCancelled && (
        <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
          Cancelled — no changes made
        </div>
      )}
    </div>
  );
}