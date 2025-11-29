import { Upload } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface EmptyProposalStateProps {
  onUploadClick: () => void;
  isUploading: boolean;
}

export function EmptyProposalState({ onUploadClick, isUploading }: EmptyProposalStateProps) {
  return (
    <div className="flex-1 flex items-center justify-center">
      <Card className="w-full max-w-2xl p-12">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
            <Upload className="w-12 h-12 text-muted-foreground" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Upload your proposal
            </h2>
            <p className="text-muted-foreground">
              PowerPoint or PDF, max 50MB
            </p>
          </div>
          <div className="border-2 border-dashed border-border rounded-lg p-12 w-full">
            <div className="flex flex-col items-center space-y-4">
              <Upload className="w-8 h-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Drag and drop your file here
              </p>
              <Button
                className="bg-[hsl(var(--gradient-blue))]"
                onClick={onUploadClick}
                disabled={isUploading}
              >
                {isUploading ? "Uploading..." : "Choose File"}
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground italic">
            Tip: Create your proposal in PowerPoint, then upload it here
          </p>
        </div>
      </Card>
    </div>
  );
}
