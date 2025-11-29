import { Play, Eye, EyeOff, GripVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Video } from "@/types";

interface VideoCardProps {
  video: Video;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onClick: (id: string) => void;
  viewMode: "grid" | "list";
}

const formatDuration = (seconds: number | null) => {
  if (!seconds) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const formatDate = (isoDate: string) => {
  const date = new Date(isoDate);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

export function VideoCard({ video, isSelected, onSelect, onClick, viewMode }: VideoCardProps) {
  const isClient = video.visibility === "client";

  return (
    <Card
      className="group hover:shadow-lg transition-shadow cursor-pointer relative"
      onClick={() => onClick(video.id)}
    >
      <div className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => {
            e.stopPropagation();
            onSelect(video.id);
          }}
          className="h-4 w-4 rounded border-gray-300"
        />
      </div>
      <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </div>
      <CardContent className="p-0">
        {/* Thumbnail */}
        <div className="relative aspect-video bg-muted rounded-t-lg flex items-center justify-center">
          {video.thumbnailUrl ? (
            <img
              src={video.thumbnailUrl}
              alt={video.title}
              className="w-full h-full object-cover rounded-t-lg"
            />
          ) : (
            <Play className="h-16 w-16 text-muted-foreground" />
          )}
          <div className="absolute bottom-2 right-2 bg-black/75 text-white px-2 py-1 rounded text-xs font-medium">
            {formatDuration(video.duration)}
          </div>
          <div className="absolute top-2 right-2">
            {isClient ? (
              <Eye className="h-4 w-4 text-white drop-shadow" />
            ) : (
              <div className="flex items-center gap-1 bg-black/75 px-2 py-1 rounded">
                <EyeOff className="h-3 w-3 text-white" />
                <span className="text-xs text-white">Internal</span>
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="p-4 space-y-2">
          <h3 className="font-semibold text-[hsl(var(--dark-grey))] line-clamp-1">
            {video.title}
          </h3>
          <p className="text-sm text-[hsl(var(--medium-grey))] line-clamp-2">
            {video.description || "No description"}
          </p>
          <div className="flex items-center justify-between text-xs text-[hsl(var(--medium-grey))]">
            <span>Added {formatDate(video.uploadedAt)}</span>
            {isClient && (
              <span>
                {video.views === 0 ? "Not yet viewed" : `Viewed ${video.views} times`}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
