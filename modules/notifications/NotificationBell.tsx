"use client";

import React, { useEffect, useRef } from "react";
import { IconBell } from "@tabler/icons-react";
import GlassCard from "@/components/glass/GlassCard";
import { useNotificationsStore } from "@/stores/useNotificationsStore";
import NotificationList from "./NotificationList";

export default function NotificationBell() {
    const { unreadCount, panelOpen, togglePanel, closePanel } = useNotificationsStore();
    const ref = useRef<HTMLDivElement>(null);

    // Close panel when clicking outside
    useEffect(() => {
        if (!panelOpen) return;
        const onDocClick = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                closePanel();
            }
        };
        document.addEventListener("mousedown", onDocClick);
        return () => document.removeEventListener("mousedown", onDocClick);
    }, [panelOpen, closePanel]);

    return (
        <div
            ref={ref}
            style={{
                position: "fixed",
                top: 20,
                right: 24,
                zIndex: 300,
                display: "flex",
                alignItems: "center",
            }}
        >
            <button
                onClick={togglePanel}
                aria-label="Notifications"
                style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    padding: 0,
                    background: "rgba(255,255,255,0.04)",
                    border: "0.5px solid var(--border-glass)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    boxShadow: "0 10px 24px rgba(0,0,0,0.28)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                }}
            >
                <IconBell size={18} />
                {unreadCount > 0 && (
                    <span
                        style={{
                            position: "absolute",
                            top: -2,
                            right: -2,
                            minWidth: 18,
                            height: 18,
                            padding: "0 5px",
                            borderRadius: 9,
                            background: "var(--accent-red)",
                            color: "#fff",
                            fontSize: 10,
                            fontWeight: 700,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 0 8px rgba(255,59,48,0.5)",
                        }}
                    >
                        {unreadCount}
                    </span>
                )}
            </button>

            {panelOpen && (
                <div
                    style={{
                        position: "absolute",
                        top: 48,
                        right: 0,
                        width: 360,
                        maxWidth: "calc(100vw - 32px)",
                        zIndex: 320,
                        animation: "fadeIn 0.15s ease",
                        boxShadow: "0 18px 40px rgba(0,0,0,0.38)",
                        borderRadius: 16,
                        overflow: "hidden",
                    }}
                >
                    <GlassCard
                        style={{
                            padding: 0,
                            maxHeight: "70vh",
                            overflow: "hidden",
                            display: "flex",
                            flexDirection: "column",
                            background: "rgba(11, 17, 28, 0.92)",
                            border: "0.5px solid var(--border-glass)",
                            borderRadius: 16,
                        }}
                    >
                        <div
                            style={{
                                padding: "14px 16px",
                                borderBottom: "0.5px solid var(--border-glass)",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <div style={{ fontSize: 14, fontWeight: 600 }}>
                                Notifications
                                {unreadCount > 0 && (
                                    <span style={{ marginLeft: 8, fontSize: 11, color: "var(--accent-blue)", fontWeight: 600 }}>
                                        {unreadCount} unread
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={closePanel}
                                style={{
                                    padding: 0,
                                    background: "transparent",
                                    border: "none",
                                    color: "var(--text-muted)",
                                    fontSize: 18,
                                    lineHeight: 1,
                                    cursor: "pointer",
                                }}
                                aria-label="Close"
                            >
                                ×
                            </button>
                        </div>
                        <div style={{ overflowY: "auto", padding: 12 }}>
                            <NotificationList />
                        </div>
                    </GlassCard>
                </div>
            )}

            <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }`}</style>
        </div>
    );
}