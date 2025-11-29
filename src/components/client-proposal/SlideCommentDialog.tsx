import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface SlideCommentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  slideNumber: number;
  onSubmit: (comment: string) => void;
  isSubmitting: boolean;
}

export function SlideCommentDialog({
  isOpen,
  onClose,
  slideNumber,
  onSubmit,
  isSubmitting,
}: SlideCommentDialogProps) {
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    if (comment.trim()) {
      onSubmit(comment);
      setComment("");
    }
  };

  const handleClose = () => {
    setComment("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-[hsl(var(--bold-royal-blue))]">
            Comment on Slide {slideNumber}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="comment">Your question or feedback</Label>
            <Textarea
              id="comment"
              placeholder="What would you like to ask about this slide?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
            />
          </div>

          <p className="text-xs text-[hsl(var(--medium-grey))]">
            Your comment will start a conversation with the AgentFlow team. They'll be
            notified and can respond directly.
          </p>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!comment.trim() || isSubmitting}
            className="bg-[hsl(var(--gradient-blue))] hover:bg-[hsl(var(--gradient-blue))]/90"
          >
            {isSubmitting ? "Sending..." : "Send Comment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
