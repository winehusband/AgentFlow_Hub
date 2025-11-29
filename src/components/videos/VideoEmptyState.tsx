import { Video, Upload, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoEmptyStateProps {
  onRecord: () => void;
  onUpload: () => void;
  onAddLink: () => void;
}

export function VideoEmptyState({ onRecord, onUpload, onAddLink }: VideoEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-muted-foreground/25 rounded-lg">
      <Video className="h-16 w-16 text-muted-foreground mb-4" />
      <h3 className="text-xl font-semibold text-[hsl(var(--dark-grey))] mb-2">No videos yet</h3>
      <p className="text-[hsl(var(--medium-grey))] mb-6">Add videos to bring your proposal to life</p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Button
          onClick={onRecord}
          className="bg-[hsl(var(--soft-coral))] hover:bg-[hsl(var(--soft-coral))]/90 text-white"
        >
          <Video className="h-4 w-4" />
          Record Video
        </Button>
        <Button
          onClick={onUpload}
          className="bg-[hsl(var(--gradient-blue))] hover:bg-[hsl(var(--gradient-blue))]/90 text-white"
        >
          <Upload className="h-4 w-4" />
          Upload File
        </Button>
        <Button
          variant="outline"
          onClick={onAddLink}
          className="border-[hsl(var(--gradient-blue))] text-[hsl(var(--gradient-blue))]"
        >
          <LinkIcon className="h-4 w-4" />
          Paste Link
        </Button>
      </div>
      <p className="text-sm text-[hsl(var(--medium-grey))] mt-6">
        Quick intro videos help clients connect with your team
      </p>
    </div>
  );
}
