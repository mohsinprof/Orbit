"use client";

import React from "react";
import GlassCard from "@/components/glass/GlassCard";
import GlassButton from "@/components/glass/GlassButton";
import Link from "next/link";
import { IconPlus, IconArrowLeft, IconLock } from "@tabler/icons-react";
import { useUiStore } from "@/stores/useUiStore";
import { mockFolders, mockItems } from "@/lib/mock/data";
import { accentHex } from "@/lib/colors";
import { percentDone, computeStatus } from "@/lib/status";
import ProgressBar from "@/components/glass/ProgressBar";

interface Props {
    folderId: string;
}

export default function FolderDetailClient({ folderId }: Props) {
    const openNewFolderModal = useUiStore((s) => s.openNewFolderModal);
    const folder = mockFolders.find((f) => f.id === folderId);
    

    if (!folder) {
        return (
            <GlassCard>
                <div style={{ fontSize: 14, color: "var(--text-muted)" }}>Folder not found.</div>
            </GlassCard>
        );
    }

    const parent = folder.parent_id ? mockFolders.find((f) => f.id === folder.parent_id) : null;
    const childFolders = mockFolders.filter((f) => f.parent_id === folder.id);
    const childItems = mockItems.filter((i) => i.folder_id === folder.id);
    const colorHex = accentHex(folder.color);
    const pace = 2.0;

    return (
        <>
            <Link
                href="/folders"
                style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    color: "var(--text-muted)",
                    fontSize: 13,
                    textDecoration: "none",
                }}
            >
                <IconArrowLeft size={16} /> Back to Folders
            </Link>

            <GlassCard>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
                    <div>
                        {parent && (
                            <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>
                                in <Link href={`/folders/${parent.id}`} style={{ color: "var(--accent-blue)", textDecoration: "none" }}>{parent.title}</Link>
                            </div>
                        )}
                        <h2 style={{ fontSize: 22, fontWeight: 700, display: "flex", alignItems: "center", gap: 10 }}>
                            <span style={{ width: 10, height: 10, borderRadius: "50%", background: colorHex }} />
                            {folder.title}
                            {folder.locked && <IconLock size={16} style={{ color: "var(--accent-orange)" }} />}
                        </h2>
                        <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>
                            {childFolders.length} subfolders · {childItems.length} items
                        </p>
                    </div>
                    <GlassButton variant="primary" icon={<IconPlus size={16} />} onClick={() => openNewFolderModal(folder.id)}>
                        New Subfolder
                    </GlassButton>
                </div>
            </GlassCard>

            {childFolders.length > 0 && (
                <GlassCard>
                    <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: "var(--text-muted)" }}>Subfolders</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {childFolders.map((sub) => {
                            const subItems = mockItems.filter((i) => i.folder_id === sub.id);
                            return (
                                <Link
                                    key={sub.id}
                                    href={`/folders/${sub.id}`}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        padding: "10px 12px",
                                        borderRadius: 10,
                                        border: "0.5px solid var(--border-glass)",
                                        textDecoration: "none",
                                        color: "var(--text-main)",
                                        fontSize: 14,
                                    }}
                                >
                                    <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        <span style={{ width: 8, height: 8, borderRadius: "50%", background: accentHex(sub.color) }} />
                                        {sub.title}
                                        {sub.locked && <IconLock size={12} style={{ color: "var(--accent-orange)" }} />}
                                    </span>
                                    <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{subItems.length} items</span>
                                </Link>
                            );
                        })}
                    </div>
                </GlassCard>
            )}

            <GlassCard>
                <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: "var(--text-muted)" }}>Items</h3>
                {childItems.length === 0 ? (
                    <div style={{ fontSize: 13, color: "var(--text-muted)", padding: "16px 0" }}>No items in this folder yet.</div>
                ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
                        {childItems.map((item) => {
                            const pct = percentDone(item);
                            const status = computeStatus(item, pace, 0);
                            return (
                                <Link key={item.id} href={`/items/${item.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                                    <div className="glass-card" style={{ cursor: "pointer" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                                            <span style={{ fontSize: 12, fontWeight: 600, color: accentHex(item.color) }}>{status.label}</span>
                                            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{pct}%</span>
                                        </div>
                                        <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>{item.title}</div>
                                        <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 10 }}>
                                            {item.done_units} / {item.total_units} {item.unit}
                                        </div>
                                        <ProgressBar value={pct} color={item.color} height={6} />
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </GlassCard>
        </>
    );
}
