"use client";

import React, { useEffect, useState } from "react";

export default function OfflineBanner() {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    setOnline(navigator.onLine);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  if (online) return null;

  return (
    <div
      style={{
        background: "linear-gradient(135deg, rgba(255,59,48,0.18), rgba(255,149,0,0.18))",
        border: "0.5px solid rgba(255,149,0,0.4)",
        color: "var(--text-main)",
        padding: "10px 16px",
        borderRadius: 12,
        fontSize: 13,
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginBottom: 16,
      }}
    >
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent-orange)" }} />
      You're offline. Edits are paused until you reconnect.
    </div>
  );
}