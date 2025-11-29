import { Button } from "@/components/ui/button";
import { Download, ExternalLink, MessageSquare } from "lucide-react";

interface ProposalHeaderProps {
  title: string;
  canDownload: boolean;
  onDownload: () => void;
  onOpenExternal: () => void;
  onAskQuestion: () => void;
}

export function ProposalHeader({
  title,
  canDownload,
  onDownload,
  onOpenExternal,
  onAskQuestion,
}: ProposalHeaderProps) {
  return (
    <div className="space-y-4 mb-8">
      <h1 className="text-3xl font-bold text-[hsl(var(--bold-royal-blue))]">{title}</h1>
      <div className="flex flex-wrap gap-3">
        {canDownload && (
          <Button
            onClick={onDownload}
            variant="outline"
            className="border-[hsl(var(--gradient-blue))] text-[hsl(var(--gradient-blue))] hover:bg-[hsl(var(--gradient-blue))]/10"
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        )}
        <Button
          onClick={onOpenExternal}
          variant="outline"
          className="border-[hsl(var(--medium-grey))] text-[hsl(var(--dark-grey))]"
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Open in New Tab
        </Button>
        <Button
          onClick={onAskQuestion}
          className="bg-[hsl(var(--soft-coral))] hover:bg-[hsl(var(--soft-coral))]/90 text-white"
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Ask a Question
        </Button>
      </div>
    </div>
  );
}
