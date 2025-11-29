import { Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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

interface RecordVideoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onStartRecording: () => void;
}

export function RecordVideoDialog({ isOpen, onClose, onStartRecording }: RecordVideoDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl text-[hsl(var(--royal-blue))]">Record Video</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
            <Video className="h-16 w-16 text-muted-foreground" />
          </div>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">Camera only</Button>
              <Button variant="outline" className="flex-1">Screen only</Button>
              <Button variant="outline" className="flex-1">Camera + Screen</Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Microphone</Label>
                <Select defaultValue="default">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default Microphone</SelectItem>
                    <SelectItem value="external">External Microphone</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Camera</Label>
                <Select defaultValue="default">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default Camera</SelectItem>
                    <SelectItem value="external">External Camera</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="flex justify-between">
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            <Button
              className="bg-[hsl(var(--soft-coral))] hover:bg-[hsl(var(--soft-coral))]/90 text-white"
              onClick={onStartRecording}
            >
              Start Recording
            </Button>
          </div>
          <p className="text-sm text-[hsl(var(--medium-grey))] text-center">
            Recordings are saved directly to this hub
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
