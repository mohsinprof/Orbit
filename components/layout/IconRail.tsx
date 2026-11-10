"use client";

import React, { Suspense, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconHome,
  IconLayoutDashboard,
  IconCalendar,
  IconChartBar,
  IconSettings,
  IconBolt,
  IconBoltOff,
} from "@tabler/icons-react";
import { useModeStore } from "@/stores/useModeStore";

const RAIL_ITEMS = [
  { href: "/home", label: "Home", icon: IconHome },
  { href: "/dashboard", label: "Dashboard", icon: IconLayoutDashboard },
  { href: "/calendar", label: "Calendar", icon: IconCalendar },
  { href: "/analytics", label: "Analytics", icon: IconChartBar },
  { href: "/settings", label: "Settings", icon: IconSettings },
];

function IconRailInner() {
  const pathname = usePathname();
  const { mode, toggleMode } = useModeStore();

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = window.localStorage.getItem("done.mode");
      if (stored === "manual" || stored === "ai") {
        if (stored !== useModeStore.getState().mode) {
          useModeStore.setState({ mode: stored });
        }
      }
    } catch {}
  }, []);

  return (
    <aside
      style={{
        width: 64,
        background: "rgba(0,0,0,0.5)",
        borderRight: "0.5px solid var(--border-glass)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "16px 8px",
        gap: 8,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        position: "sticky",
        top: 0,
        height: "100vh",
        flexShrink: 0,
        zIndex: 50,
      }}
      className="hidden md:flex"
    >
      <div
        style={{
          width: 32, height: 32, borderRadius: 10,
          background: "linear-gradient(135deg, var(--accent-red), var(--accent-orange))",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", fontWeight: 700, fontSize: 14, marginBottom: 8,
          boxShadow: "0 4px 12px rgba(255,59,48,0.3)",
        }}
      >
        D
      </div>

      {RAIL_ITEMS.map((item) => {
        const Icon = item.icon;
        const active = pathname === item.href || (item.href !== "/home" && pathname.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-label={item.label}
            title={item.label}
            style={{
              width: 40, height: 40, borderRadius: 10,
              display: "flex", alignItems: "center", justifyContent: "center",
              background: active ? "rgba(255,255,255,0.08)" : "transparent",
              border: active ? "0.5px solid var(--border-glass)" : "0.5px solid transparent",
              color: active ? "var(--accent-blue)" : "var(--text-muted)",
              transition: "all 0.15s",
              textDecoration: "none",
            }}
          >
            <Icon size={20} />
          </Link>
        );
      })}

      <div style={{ flex: 1 }} />

      <button
        onClick={toggleMode}
        aria-label={mode === "ai" ? "Switch to Manual mode" : "Switch to AI mode"}
        title={mode === "ai" ? "AI mode — click to switch to Manual" : "Manual mode — click to switch to AI"}
        style={{
          width: 40, height: 40, borderRadius: 10,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: mode === "ai" ? "rgba(0,240,255,0.1)" : "rgba(255,149,0,0.1)",
          border: mode === "ai" ? "0.5px solid rgba(0,240,255,0.3)" : "0.5px solid rgba(255,149,0,0.3)",
          color: mode === "ai" ? "var(--accent-blue)" : "var(--accent-orange)",
          cursor: "pointer",
          transition: "all 0.2s",
        }}
      >
        {mode === "ai" ? <IconBolt size={18} /> : <IconBoltOff size={18} />}
      </button>
    </aside>
  );
}

export default function IconRail() {
  return (
    <Suspense fallback={<aside className="hidden md:flex" style={{ width: 64, background: "rgba(0,0,0,0.5)" }} />}>
      <IconRailInner />
    </Suspense>
  );
}
