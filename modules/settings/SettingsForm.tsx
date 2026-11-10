"use client";

import React, { useState } from "react";
import GlassCard from "@/components/glass/GlassCard";
import GlassButton from "@/components/glass/GlassButton";
import { mockSettings } from "@/lib/mock/data";
import { useModeStore } from "@/stores/useModeStore";
import type { Settings } from "@/lib/types";
import { IconBolt, IconBoltOff } from "@tabler/icons-react";

export default function SettingsForm() {
  const [settings, setSettings] = useState<Settings>(mockSettings);
  const [saved, setSaved] = useState(false);
  const { mode, setMode } = useModeStore();

  const update = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((s) => ({ ...s, [key]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <GlassCard style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 600 }}>Preferences</h3>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>Customize how Done works for you</p>
        </div>
        {saved && <span style={{ fontSize: 12, color: "var(--accent-blue)", fontWeight: 600 }}>✓ Saved</span>}
      </div>

      {/* AI Mode Toggle */}
      <div style={{
        padding: 16,
        background: mode === "ai" ? "rgba(0,240,255,0.05)" : "rgba(255,149,0,0.05)",
        border: mode === "ai" ? "0.5px solid rgba(0,240,255,0.25)" : "0.5px solid rgba(255,149,0,0.25)",
        borderRadius: 12,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {mode === "ai" ? <IconBolt size={18} style={{ color: "var(--accent-blue)" }} /> : <IconBoltOff size={18} style={{ color: "var(--accent-orange)" }} />}
            <span style={{ fontSize: 14, fontWeight: 600 }}>
              {mode === "ai" ? "AI Mode" : "Manual Mode"}
            </span>
          </div>
          <button
            onClick={() => setMode(mode === "ai" ? "manual" : "ai")}
            style={{
              width: 44, height: 24, borderRadius: 12, padding: 0,
              background: mode === "ai" ? "var(--accent-blue)" : "rgba(255,149,0,0.5)",
              border: "none", cursor: "pointer", position: "relative",
            }}
            aria-label="Toggle AI mode"
          >
            <span style={{
              position: "absolute", top: 2, left: mode === "ai" ? 22 : 2,
              width: 20, height: 20, borderRadius: "50%", background: "#fff",
              transition: "left 0.2s",
            }} />
          </button>
        </div>
        <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5 }}>
          {mode === "ai"
            ? "Orbit AI is active. Chat with Orbit on the home screen, get proactive greetings, and let Orbit propose actions."
            : "AI is off. Home screen shows a pure timer widget and flat task list. No chat, no proactive messages."}
        </p>
      </div>

      {/* Daily Target */}
      <div>
        <label style={{ fontSize: 13, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>Daily Target Hours</label>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <input type="range" min="1" max="12" step="0.5" value={settings.daily_target_hours} onChange={(e) => update("daily_target_hours", parseFloat(e.target.value))} style={{ flex: 1, padding: 0 }} />
          <span style={{ fontSize: 16, fontWeight: 600, minWidth: 50, textAlign: "right" }}>{settings.daily_target_hours.toFixed(1)}h</span>
        </div>
      </div>

      {/* Theme */}
      <div>
        <label style={{ fontSize: 13, color: "var(--text-muted)", display: "block", marginBottom: 8 }}>App Theme</label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {([
            { value: "dark", label: "Dark Liquid", hint: "Default glass look" },
            { value: "light", label: "Minimal Light", hint: "Bright & clean" },
            { value: "system", label: "System Auto", hint: "Follow device" },
          ] as const).map((opt) => (
            <button
              key={opt.value}
              onClick={() => update("theme", opt.value)}
              style={{
                padding: "12px",
                background: settings.theme === opt.value ? "rgba(0,240,255,0.08)" : "rgba(0,0,0,0.3)",
                border: settings.theme === opt.value ? "0.5px solid var(--accent-blue)" : "0.5px solid var(--border-glass)",
                borderRadius: 10, textAlign: "left", cursor: "pointer",
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 600, color: settings.theme === opt.value ? "var(--accent-blue)" : "var(--text-main)" }}>{opt.label}</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{opt.hint}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Timezone + Week start */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <label style={{ fontSize: 13, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>Timezone</label>
          <select value={settings.timezone} onChange={(e) => update("timezone", e.target.value)}>
            <option value="Asia/Karachi">Asia/Karachi (PKT)</option>
            <option value="Asia/Dubai">Asia/Dubai (GST)</option>
            <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
            <option value="Europe/London">Europe/London (GMT)</option>
            <option value="America/New_York">America/New_York (EST)</option>
          </select>
        </div>
        <div>
          <label style={{ fontSize: 13, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>Week Starts On</label>
          <select value={settings.week_starts_on} onChange={(e) => update("week_starts_on", e.target.value as "monday" | "sunday")}>
            <option value="monday">Monday</option>
            <option value="sunday">Sunday</option>
          </select>
        </div>
      </div>

      {/* AI Model (only if AI mode) */}
      {mode === "ai" && (
        <div>
          <label style={{ fontSize: 13, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>AI Model (Orbit)</label>
          <select value={settings.ai_model} onChange={(e) => update("ai_model", e.target.value)}>
            <option value="llama-3.1-8b-instant">Llama 3.1 8B Instant (recommended)</option>
            <option value="llama-3.3-70b-versatile">Llama 3.3 70B Versatile</option>
            <option value="mixtral-8x7b-32768">Mixtral 8x7B</option>
            <option value="gemma2-9b-it">Gemma 2 9B IT</option>
          </select>
          <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 6 }}>Only used in AI mode.</p>
        </div>
      )}

      {/* Notifications */}
      <div>
        <label style={{ fontSize: 13, color: "var(--text-muted)", display: "block", marginBottom: 8 }}>In-app Notifications</label>
        <button
          onClick={() => update("notifications_enabled", !settings.notifications_enabled)}
          style={{
            display: "inline-flex", alignItems: "center", gap: 10, padding: "10px 14px",
            background: settings.notifications_enabled ? "rgba(0,240,255,0.08)" : "rgba(0,0,0,0.3)",
            border: settings.notifications_enabled ? "0.5px solid var(--accent-blue)" : "0.5px solid var(--border-glass)",
            borderRadius: 10, cursor: "pointer", fontSize: 13,
          }}
        >
          <span style={{
            width: 32, height: 18, borderRadius: 9, position: "relative",
            background: settings.notifications_enabled ? "var(--accent-blue)" : "rgba(255,255,255,0.15)",
          }}>
            <span style={{
              position: "absolute", top: 2, left: settings.notifications_enabled ? 16 : 2,
              width: 14, height: 14, borderRadius: "50%", background: "#fff", transition: "left 0.2s",
            }} />
          </span>
          {settings.notifications_enabled ? "Enabled" : "Disabled"}
        </button>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <GlassButton variant="primary" onClick={handleSave}>Save preferences</GlassButton>
      </div>
    </GlassCard>
  );
}