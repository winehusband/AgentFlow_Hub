import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useHubId } from "@/contexts/hub-context";
import {
  useProposal,
  useProposalEngagement,
  useUpdateProposalSettings,
  useUploadProposal,
  useDeleteProposal,
  useTrackEngagement,
} from "@/hooks";
import {
  ClientEngagementPanel,
  SlideEngagementPanel,
  VersionHistoryPanel,
  ClientAccessPanel,
  ProposalViewer,
  ProposalInfoBar,
  EmptyProposalState,
} from "./proposal";

export function ProposalSection() {
  const hubId = useHubId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentSlide, setCurrentSlide] = useState(1);

  const { data: proposal, isLoading, isError } = useProposal(hubId);
  const { data: engagement } = useProposalEngagement(hubId);
  const { mutate: updateSettings } = useUpdateProposalSettings(hubId);
  const { mutate: uploadProposal, isPending: isUploading } = useUploadProposal(hubId);
  const { mutate: deleteProposal, isPending: isDeleting } = useDeleteProposal(hubId);
  const { trackProposalViewed, trackProposalSlideTime } = useTrackEngagement(hubId);

  // Track proposal view on mount when proposal exists
  useEffect(() => {
    if (proposal) {
      trackProposalViewed(proposal.id, currentSlide);
    }
  }, [proposal, currentSlide, trackProposalViewed]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadProposal({ file, replaceExisting: !!proposal });
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleVisibilityChange = (isVisible: boolean) => {
    updateSettings({ isClientVisible: isVisible });
  };

  const handleDownloadChange = (isEnabled: boolean) => {
    updateSettings({ isDownloadEnabled: isEnabled });
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this proposal?")) {
      deleteProposal();
    }
  };

  const handlePrevSlide = () => {
    setCurrentSlide(Math.max(1, currentSlide - 1));
  };

  const handleNextSlide = () => {
    const totalSlides = proposal?.totalSlides || 0;
    setCurrentSlide(Math.min(totalSlides, currentSlide + 1));
  };

  const handleSlideTimeSpent = (slideNum: number, seconds: number) => {
    if (proposal) {
      trackProposalSlideTime(proposal.id, slideNum, seconds);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-[hsl(var(--gradient-blue))]" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-destructive">Failed to load proposal.</p>
      </div>
    );
  }

  // Hidden file input for uploads
  const fileInput = (
    <input
      type="file"
      ref={fileInputRef}
      onChange={handleFileSelect}
      accept=".pptx,.ppt,.pdf"
      className="hidden"
    />
  );

  if (!proposal) {
    return (
      <div className="flex flex-col h-full">
        {fileInput}
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[hsl(var(--bold-royal-blue))]">
              Proposal
            </h1>
          </div>
          <Button
            className="bg-[hsl(var(--gradient-blue))]"
            onClick={handleUploadClick}
            disabled={isUploading}
          >
            {isUploading ? "Uploading..." : "Upload Proposal"}
          </Button>
        </div>

        <EmptyProposalState
          onUploadClick={handleUploadClick}
          isUploading={isUploading}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {fileInput}
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[hsl(var(--bold-royal-blue))]">
              Proposal
            </h1>
          </div>
          <Button
            className="bg-[hsl(var(--gradient-blue))]"
            onClick={handleUploadClick}
            disabled={isUploading}
          >
            {isUploading ? "Uploading..." : "Upload New Version"}
          </Button>
        </div>

        <ProposalInfoBar
          proposal={proposal}
          onReplace={handleUploadClick}
          onDelete={handleDelete}
          isDeleting={isDeleting}
        />

        <ProposalViewer
          currentSlide={currentSlide}
          totalSlides={proposal.totalSlides}
          onPrevSlide={handlePrevSlide}
          onNextSlide={handleNextSlide}
          onSlideTimeSpent={handleSlideTimeSpent}
        />

        <ClientAccessPanel
          settings={proposal.settings}
          onVisibilityChange={handleVisibilityChange}
          onDownloadChange={handleDownloadChange}
        />
      </div>

      {/* Right sidebar */}
      <div className="w-full lg:w-80 space-y-6">
        <ClientEngagementPanel engagement={engagement} />
        <SlideEngagementPanel engagement={engagement} />
        <VersionHistoryPanel
          versions={proposal.versions}
          uploadedAt={proposal.uploadedAt}
        />
      </div>
    </div>
  );
}
