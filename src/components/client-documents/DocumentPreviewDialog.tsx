import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText, Download, ExternalLink } from "lucide-react";
import type { Document } from "@/types";

interface DocumentPreviewDialogProps {
  document: Document | null;
  isOpen: boolean;
  onClose: () => void;
  onDownload: (doc: Document) => void;
}

export function DocumentPreviewDialog({
  document,
  isOpen,
  onClose,
  onDownload,
}: DocumentPreviewDialogProps) {
  if (!document) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-xl text-[hsl(var(--bold-royal-blue))]">{document.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Document Preview Placeholder */}
          <div className="aspect-[4/3] bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center space-y-3">
              <FileText className="h-16 w-16 mx-auto text-muted-foreground" />
              <p className="text-muted-foreground">Document preview would appear here</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              className="bg-[hsl(var(--gradient-blue))] hover:bg-[hsl(var(--gradient-blue))]/90"
              onClick={() => onDownload(document)}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button variant="outline">
              <ExternalLink className="h-4 w-4 mr-2" />
              Open in new tab
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
