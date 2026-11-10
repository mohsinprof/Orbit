import FolderDetailClient from "@/modules/folders/FolderDetailClient";

export default async function FolderDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    return <FolderDetailClient folderId={id} />;
}
