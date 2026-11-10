"use client";

import React, { useState } from "react";
import GlassCard from "@/components/glass/GlassCard";
import GlassButton from "@/components/glass/GlassButton";
import GlassModal from "@/components/glass/GlassModal";
import { IconDownload, IconTrash, IconAlertTriangle } from "@tabler/icons-react";

export default function DataManagement() {
  const [exporting, setExporting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  const handleExport = () => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      alert("Mock export: backup.json downloaded");
    }, 800);
  };

  const handleClear = () => {
    if (confirmText === "DELETE") {
      alert("Mock: All your data would be permanently deleted.");
      setConfirmOpen(false);
      setConfirmText("");
    }
  };

  return (
    <GlassCard>
      <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Data Management</h3>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 14,
            background: "rgba(0,0,0,0.3)",
            borderRadius: 10,
            border: "0.5px solid var(--border-glass)",
          }}
        >
          <div>
            <div style={{ fontSize: 14, fontWeight: 500 }}>Export backup</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
              Download all your folders, items, logs, sessions and history as JSON
            </div>
          </div>
          <GlassButton
            onClick={handleExport}
            disabled={exporting}
            icon={<IconDownload size={16} />}
          >
            {exporting ? "Exporting…" : "Export JSON"}
          </GlassButton>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 14,
            background: "rgba(255,59,48,0.05)",
            borderRadius: 10,
            border: "0.5px solid rgba(255,59,48,0.3)",
          }}
        >
          <div>
            <div style={{ fontSize: 14, fontWeight: 500, color: "var(--accent-red)" }}>
              Clear all data
            </div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
              Permanently delete everything. Cannot be undone.
            </div>
          </div>
          <GlassButton
            onClick={() => setConfirmOpen(true)}
            style={{
              background: "rgba(255,59,48,0.2)",
              borderColor: "rgba(255,59,48,0.4)",
              color: "var(--accent-red)",
            }}
            icon={<IconTrash size={16} />}
          >
            Clear All
          </GlassButton>
        </div>
      </div>

      <GlassModal
        open={confirmOpen}
        onClose={() => {
          setConfirmOpen(false);
          setConfirmText("");
        }}
        title="Confirm deletion"
        width={440}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              display: "flex",
              gap: 12,
              padding: 14,
              background: "rgba(255,59,48,0.08)",
              borderRadius: 10,
              border: "0.5px solid rgba(255,59,48,0.3)",
            }}
          >
            <IconAlertTriangle size={20} style={{ color: "var(--accent-red)", flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--accent-red)" }}>
                This action cannot be undone
              </div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>
                All folders, items, sessions, logs and history will be permanently deleted.
                Export a backup first if you want to keep your data.
              </div>
            </div>
          </div>

          <div>
            <label style={{ fontSize: 12, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>
              Type <code style={{ color: "var(--accent-red)" }}>DELETE</code> to confirm
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="DELETE"
              autoFocus
              style={{ color: "var(--accent-red)" }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <GlassButton
              onClick={() => {
                setConfirmOpen(false);
                setConfirmText("");
              }}
            >
              Cancel
            </GlassButton>
            <GlassButton
              variant="primary"
              onClick={handleClear}
              disabled={confirmText !== "DELETE"}
              style={{
                opacity: confirmText === "DELETE" ? 1 : 0.4,
              }}
            >
              Delete everything
            </GlassButton>
          </div>
        </div>
      </GlassModal>
    </GlassCard>
  );
}