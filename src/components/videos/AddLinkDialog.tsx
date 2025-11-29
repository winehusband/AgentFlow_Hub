import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { VideoVisibility, AddVideoLinkRequest } from "@/types";

interface AddLinkDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: AddVideoLinkRequest) => void;
  isAdding: boolean;
}

export function AddLinkDialog({ isOpen, onClose, onAdd, isAdding }: AddLinkDialogProps) {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState<VideoVisibility>("client");

  const handleSubmit = () => {
    if (!url.trim() || !title.trim()) return;
    onAdd({ url, title, description: description || undefined, visibility });
  };

  const handleClose = () => {
    setUrl("");
    setTitle("");
    setDescription("");
    setVisibility("client");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl text-[hsl(var(--royal-blue))]">Add Video Link</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Video URL</Label>
            <Input
              placeholder="Paste YouTube, Vimeo, or Loom link"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <p className="text-xs text-[hsl(var(--medium-grey))]">
              Supported: YouTube, Vimeo, Loom
            </p>
          </div>

          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              placeholder="Video title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Description (optional)</Label>
            <Textarea
              placeholder="Brief description of the video"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label>Visibility</Label>
            <Select value={visibility} onValueChange={(v) => setVisibility(v as VideoVisibility)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="client">Client Visible</SelectItem>
                <SelectItem value="internal">Internal Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-between">
            <Button variant="ghost" onClick={handleClose}>Cancel</Button>
            <Button
              className="bg-[hsl(var(--gradient-blue))] hover:bg-[hsl(var(--gradient-blue))]/90 text-white"
              onClick={handleSubmit}
              disabled={!url.trim() || !title.trim() || isAdding}
            >
              {isAdding ? "Adding..." : "Add Video"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
