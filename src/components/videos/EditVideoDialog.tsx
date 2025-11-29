import { useState, useEffect } from "react";
import { Play, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Video, UpdateVideoRequest } from "@/types";

interface EditVideoDialogProps {
  video: Video | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: UpdateVideoRequest) => void;
  onDelete: () => void;
  isSaving: boolean;
  isDeleting: boolean;
}

export function EditVideoDialog({
  video,
  isOpen,
  onClose,
  onSave,
  onDelete,
  isSaving,
  isDeleting,
}: EditVideoDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isClientVisible, setIsClientVisible] = useState(true);

  useEffect(() => {
    if (video) {
      setTitle(video.title);
      setDescription(video.description || "");
      setIsClientVisible(video.visibility === "client");
    }
  }, [video]);

  const handleSave = () => {
    onSave({
      title,
      description: description || undefined,
      visibility: isClientVisible ? "client" : "internal",
    });
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this video?")) {
      onDelete();
    }
  };

  if (!video) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl text-[hsl(var(--royal-blue))]">Edit Video</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* Video Player */}
          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center overflow-hidden">
            {video.thumbnailUrl ? (
              <img
                src={video.thumbnailUrl}
                alt={video.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <Play className="h-20 w-20 text-muted-foreground" />
            )}
          </div>

          {/* Editable Fields */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Thumbnail</Label>
              <div className="flex items-center gap-4">
                <div className="w-32 aspect-video bg-muted rounded flex items-center justify-center overflow-hidden">
                  {video.thumbnailUrl ? (
                    <img
                      src={video.thumbnailUrl}
                      alt="Thumbnail"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Play className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <p className="text-sm text-[hsl(var(--medium-grey))]">Auto-generated</p>
                  <Button variant="outline" size="sm">Upload custom</Button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="space-y-1">
                <Label>Visible to client</Label>
                <p className="text-xs text-[hsl(var(--medium-grey))]">
                  Toggle on to show this video in the client portal
                </p>
              </div>
              <Switch
                checked={isClientVisible}
                onCheckedChange={setIsClientVisible}
              />
            </div>
          </div>

          <div className="flex justify-between">
            <Button
              variant="ghost"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4" />
              {isDeleting ? "Deleting..." : "Delete Video"}
            </Button>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button
                className="bg-[hsl(var(--gradient-blue))] hover:bg-[hsl(var(--gradient-blue))]/90 text-white"
                onClick={handleSave}
                disabled={!title.trim() || isSaving}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
