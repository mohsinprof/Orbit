"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    IconChevronRight,
    IconChevronDown,
    IconFolder,
    IconLock,
    IconDots,
    IconPlus,
} from "@tabler/icons-react";
import type { Folder, Item } from "@/lib/types";
import { accentHex } from "@/lib/colors";
import { percentDone } from "@/lib/status";
import { useUiStore } from "@/stores/useUiStore";

interface Props {
    folder: Folder;
    childFolders: Folder[];
    childItems: Item[];
    depth: number;
    allFolders: Folder[];
    allItems: Item[];
}

export default function FolderRow({ folder, childFolders, childItems, depth, allFolders, allItems }: Props) {
    const router = useRouter();
    const expanded = useUiStore((s) => s.expandedFolders[folder.id] ?? false);
    const toggleFolder = useUiStore((s) => s.toggleFolder);
    const openNewFolderModal = useUiStore((s) => s.openNewFolderModal);

    const colorHex = accentHex(folder.color);
    const hasChildren = childFolders.length > 0 || childItems.length > 0;

    return (
        <div>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 12px",
                    borderRadius: 10,
                    border: "0.5px solid transparent",
                    cursor: "pointer",
                    paddingLeft: 12 + depth * 20,
                    transition: "background 0.15s",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.04)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.background = "transparent")}
                onClick={() => toggleFolder(folder.id)}
            >
                {hasChildren ? expanded ? <IconChevronDown size={16} /> : <IconChevronRight size={16} /> : <span style={{ width: 16 }} />}

                <IconFolder size={18} style={{ color: colorHex }} />

                <Link
                    href={`/folders/${folder.id}`}
                    style={{ flex: 1, color: "var(--text-main)", textDecoration: "none", fontSize: 14, fontWeight: 500 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {folder.title}
                </Link>

                {folder.locked && <IconLock size={14} style={{ color: "var(--accent-orange)" }} />}

                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                    {childItems.length} {childItems.length === 1 ? "item" : "items"}
                </span>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        openNewFolderModal(folder.id);
                    }}
                    style={{ padding: 4, background: "transparent", border: "none" }}
                    aria-label="Add subfolder"
                >
                    <IconPlus size={14} />
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/folders/${folder.id}`);
                    }}
                    style={{ padding: 4, background: "transparent", border: "none" }}
                    aria-label="Folder options"
                >
                    <IconDots size={16} />
                </button>
            </div>

            {expanded && hasChildren && (
                <div>
                    {childItems.map((item) => (
                        <ItemRow key={item.id} item={item} depth={depth + 1} />
                    ))}
                    {childFolders.map((sub) => {
                        const subs = allFolders.filter((f) => f.parent_id === sub.id);
                        const items = allItems.filter((i) => i.folder_id === sub.id);
                        return (
                            <FolderRow
                                key={sub.id}
                                folder={sub}
                                childFolders={subs}
                                childItems={items}
                                depth={depth + 1}
                                allFolders={allFolders}
                                allItems={allItems}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
}

function ItemRow({ item, depth }: { item: Item; depth: number }) {
    const router = useRouter();
    const pct = percentDone(item);
    const colorHex = accentHex(item.color);

    return (
        <div
            onClick={() => router.push(`/items/${item.id}`)}
            style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 12px",
                paddingLeft: 12 + depth * 20 + 24,
                borderRadius: 8,
                cursor: "pointer",
                fontSize: 13,
                color: "var(--text-muted)",
                transition: "background 0.15s",
            }}
            onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.03)";
                (e.currentTarget as HTMLDivElement).style.color = "var(--text-main)";
            }}
            onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.background = "transparent";
                (e.currentTarget as HTMLDivElement).style.color = "var(--text-muted)";
            }}
        >
            <span
                style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: colorHex,
                    flexShrink: 0,
                }}
            />
            <span style={{ flex: 1 }}>{item.title}</span>
            <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{pct}%</span>
        </div>
    );
}
