import { FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Proposal } from "@/types";

interface ProposalInfoBarProps {
  proposal: Proposal;
  onReplace: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const formatDate = (isoDate: string) => {
  const date = new Date(isoDate);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

export function ProposalInfoBar({
  proposal,
  onReplace,
  onDelete,
  isDeleting,
}: ProposalInfoBarProps) {
  return (
    <Card className="p-4 mb-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          <FileText className="w-8 h-8 text-[hsl(var(--gradient-blue))] flex-shrink-0 mt-1" />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground break-words">
              {proposal.fileName}
            </h3>
            <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-muted-foreground">
              <span>Uploaded {formatDate(proposal.uploadedAt)}</span>
              <span>·</span>
              <span>{proposal.totalSlides} slides</span>
              <span>·</span>
              <span>{formatFileSize(proposal.fileSize)}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onReplace}>
            Replace
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive"
            onClick={onDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
