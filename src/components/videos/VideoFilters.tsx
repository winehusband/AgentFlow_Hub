import { Grid3x3, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { VideoVisibility } from "@/types";

interface VideoFiltersProps {
  visibilityFilter: "all" | VideoVisibility;
  onVisibilityChange: (value: "all" | VideoVisibility) => void;
  sortBy: "newest" | "oldest" | "most-viewed";
  onSortChange: (value: "newest" | "oldest" | "most-viewed") => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
}

export function VideoFilters({
  visibilityFilter,
  onVisibilityChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
}: VideoFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between bg-muted/50 p-4 rounded-lg">
      <div className="flex flex-wrap gap-2 flex-1">
        <Select value={visibilityFilter} onValueChange={(v) => onVisibilityChange(v as "all" | VideoVisibility)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Videos</SelectItem>
            <SelectItem value="client">Client Visible</SelectItem>
            <SelectItem value="internal">Internal Only</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={(v) => onSortChange(v as "newest" | "oldest" | "most-viewed")}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest first</SelectItem>
            <SelectItem value="oldest">Oldest first</SelectItem>
            <SelectItem value="most-viewed">Most viewed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-1 border rounded-md">
        <Button
          variant={viewMode === "grid" ? "secondary" : "ghost"}
          size="icon"
          className="h-9 w-9"
          onClick={() => onViewModeChange("grid")}
        >
          <Grid3x3 className="h-4 w-4" />
        </Button>
        <Button
          variant={viewMode === "list" ? "secondary" : "ghost"}
          size="icon"
          className="h-9 w-9"
          onClick={() => onViewModeChange("list")}
        >
          <List className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
