"use client";

import React from "react";
import type { Folder, Item } from "@/lib/types";
import FolderRow from "./FolderRow";
import EmptyState from "@/components/shared/EmptyState";

interface Props {
    folders: Folder[];
    items: Item[];
}

export default function FolderTree({ folders, items }: Props) {
    const roots = folders.filter((f) => f.parent_id === null && !f.archived_at);

    if (roots.length === 0) {
        return <EmptyState title="No folders yet" hint="Create your first folder to start organizing your tasks." />;
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {roots.map((folder) => {
                const subs = folders.filter((f) => f.parent_id === folder.id);
                const folderItems = items.filter((i) => i.folder_id === folder.id);
                return (
                    <FolderRow
                        key={folder.id}
                        folder={folder}
                        childFolders={subs}
                        childItems={folderItems}
                        depth={0}
                        allFolders={folders}
                        allItems={items}
                    />
                );
            })}
        </div>
    );
}
