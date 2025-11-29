import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface VideoBulkActionsBarProps {
  selectedCount: number;
  onChangeVisibility: () => void;
  onDelete: () => void;
}

export function VideoBulkActionsBar({
  selectedCount,
  onChangeVisibility,
  onDelete,
}: VideoBulkActionsBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[hsl(var(--deep-navy))] text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-4 z-50">
      <span className="font-medium">{selectedCount} selected</span>
      <Separator orientation="vertical" className="h-6 bg-white/20" />
      <Button
        size="sm"
        variant="ghost"
        className="text-white hover:bg-white/20"
        onClick={onChangeVisibility}
      >
        Change visibility
      </Button>
      <Button
        size="sm"
        variant="ghost"
        className="text-red-400 hover:bg-red-400/20"
        onClick={onDelete}
      >
        <Trash2 className="h-4 w-4" />
        Delete
      </Button>
    </div>
  );
}
