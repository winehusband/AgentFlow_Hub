import { useState, useCallback } from "react";
import { Upload } from "lucide-react";
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
import type { VideoVisibility } from "@/types";

interface UploadVideoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (data: { file: File; title: string; description?: string; visibility: VideoVisibility }) => void;
  isUploading: boolean;
}

export function UploadVideoDialog({ isOpen, onClose, onUpload, isUploading }: UploadVideoDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState<VideoVisibility>("client");

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (!title) {
        setTitle(selectedFile.name.replace(/\.[^/.]+$/, ""));
      }
    }
  }, [title]);

  const handleSubmit = () => {
    if (!file || !title.trim()) return;
    onUpload({ file, title, description: description || undefined, visibility });
  };

  const handleClose = () => {
    setFile(null);
    setTitle("");
    setDescription("");
    setVisibility("client");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl text-[hsl(var(--royal-blue))]">Upload Video</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {!file ? (
            <label className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 text-center block cursor-pointer hover:border-muted-foreground/50 transition-colors">
              <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-[hsl(var(--dark-grey))] font-medium mb-2">
                Drag and drop video here
              </p>
              <p className="text-sm text-[hsl(var(--medium-grey))] mb-4">or</p>
              <Button variant="outline" type="button">Choose file</Button>
              <input
                type="file"
                accept="video/*"
                className="hidden"
                onChange={handleFileChange}
              />
              <p className="text-xs text-[hsl(var(--medium-grey))] mt-4">
                Supported formats: MP4, MOV, WebM — Max 500MB
              </p>
            </label>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-[hsl(var(--medium-grey))]">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>

              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label>Description (optional)</Label>
                <Textarea
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
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={handleClose}>Cancel</Button>
            {file && (
              <Button
                className="bg-[hsl(var(--gradient-blue))] hover:bg-[hsl(var(--gradient-blue))]/90 text-white"
                onClick={handleSubmit}
                disabled={!title.trim() || isUploading}
              >
                {isUploading ? "Uploading..." : "Upload"}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
