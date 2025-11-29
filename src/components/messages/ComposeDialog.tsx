import { useState } from "react";
import { Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ComposeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (data: { to: string[]; subject: string; bodyHtml: string }) => void;
  isSending: boolean;
  defaultTo?: string;
}

export function ComposeDialog({
  isOpen,
  onClose,
  onSend,
  isSending,
  defaultTo = "",
}: ComposeDialogProps) {
  const [to, setTo] = useState(defaultTo);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const handleSend = () => {
    if (!to.trim() || !subject.trim() || !body.trim()) return;

    onSend({
      to: to.split(",").map((email) => email.trim()),
      subject,
      bodyHtml: `<p>${body.replace(/\n/g, "</p><p>")}</p>`,
    });

    // Reset form
    setTo(defaultTo);
    setSubject("");
    setBody("");
  };

  const handleClose = () => {
    setTo(defaultTo);
    setSubject("");
    setBody("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>New Message</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div>
            <label className="text-sm font-medium mb-1 block">To</label>
            <Input
              placeholder="email@example.com"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Subject</label>
            <Input
              placeholder="Enter subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Message</label>
            <Textarea
              placeholder="Write your message..."
              className="min-h-[200px]"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Paperclip className="h-4 w-4 mr-2" />
              Attach Files
            </Button>
          </div>
          <div className="flex items-center justify-between pt-4">
            <p className="text-xs text-[hsl(var(--medium-grey))]">
              Message will be sent via Outlook
            </p>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                className="bg-[hsl(var(--gradient-blue))] hover:bg-[hsl(var(--gradient-blue))]/90"
                onClick={handleSend}
                disabled={!to.trim() || !subject.trim() || !body.trim() || isSending}
              >
                {isSending ? "Sending..." : "Send"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
