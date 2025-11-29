import { Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { DocumentVisibility } from "@/types";

interface BulkActionsBarProps {
  selectedCount: number;
  currentVisibility: DocumentVisibility;
  onDownload: () => void;
  onMoveVisibility: () => void;
  onChangeCategory: () => void;
  onDelete: () => void;
}

export function BulkActionsBar({
  selectedCount,
  currentVisibility,
  onDownload,
  onMoveVisibility,
  onChangeCategory,
  onDelete,
}: BulkActionsBarProps) {
  if (selectedCount === 0) return null;

  const isClientTab = currentVisibility === "client";

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[hsl(var(--deep-navy))] text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-4 z-50">
      <span className="font-medium">{selectedCount} selected</span>
      <Separator orientation="vertical" className="h-6 bg-white/20" />
      <Button
        size="sm"
        variant="ghost"
        className="text-white hover:bg-white/20"
        onClick={onDownload}
      >
        <Download className="h-4 w-4 mr-2" />
        Download
      </Button>
      <Button
        size="sm"
        variant="ghost"
        className="text-white hover:bg-white/20"
        onClick={onMoveVisibility}
      >
        Move to {isClientTab ? "Internal" : "Client"}
      </Button>
      <Button
        size="sm"
        variant="ghost"
        className="text-white hover:bg-white/20"
        onClick={onChangeCategory}
      >
        Change category
      </Button>
      <Button
        size="sm"
        variant="ghost"
        className="text-red-400 hover:bg-red-400/20"
        onClick={onDelete}
      >
        <Trash2 className="h-4 w-4 mr-2" />
        Delete
      </Button>
    </div>
  );
}
