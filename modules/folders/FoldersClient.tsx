"use client";

import React from "react";
import GlassCard from "@/components/glass/GlassCard";
import GlassButton from "@/components/glass/GlassButton";
import FolderTree from "./FolderTree";
import { useUiStore } from "@/stores/useUiStore";
import { mockFolders, mockItems } from "@/lib/mock/data";
import { IconPlus } from "@tabler/icons-react";

export default function FoldersClient() {
    const openNewFolderModal = useUiStore((s) => s.openNewFolderModal);

    return (
        <GlassCard>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 16,
                    gap: 12,
                    flexWrap: "wrap",
                }}
            >
                <div>
                    <h3 style={{ fontSize: 18, fontWeight: 600 }}>Workspace & Hierarchy</h3>
                    <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>
                        {mockFolders.length} folders · {mockItems.length} items
                    </p>
                </div>
                <GlassButton variant="primary" icon={<IconPlus size={16} />} onClick={() => openNewFolderModal(null)}>
                    New Folder
                </GlassButton>
            </div>
            <FolderTree folders={mockFolders} items={mockItems} />
        </GlassCard>
    );
}
