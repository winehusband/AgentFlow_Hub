import { useEffect, useRef } from "react";
import {
  FileText,
  Download,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ProposalViewerProps {
  currentSlide: number;
  totalSlides: number;
  onPrevSlide: () => void;
  onNextSlide: () => void;
  onSlideTimeSpent?: (slideNum: number, seconds: number) => void;
}

export function ProposalViewer({
  currentSlide,
  totalSlides,
  onPrevSlide,
  onNextSlide,
  onSlideTimeSpent,
}: ProposalViewerProps) {
  const slideStartTime = useRef<number>(Date.now());
  const lastTrackedSlide = useRef<number>(currentSlide);

  // Track time spent on slide when navigating away
  useEffect(() => {
    if (lastTrackedSlide.current !== currentSlide && onSlideTimeSpent) {
      const timeSpent = Math.round((Date.now() - slideStartTime.current) / 1000);
      if (timeSpent >= 2) {
        onSlideTimeSpent(lastTrackedSlide.current, timeSpent);
      }
      slideStartTime.current = Date.now();
      lastTrackedSlide.current = currentSlide;
    }
  }, [currentSlide, onSlideTimeSpent]);

  // Track time on unmount
  useEffect(() => {
    return () => {
      if (onSlideTimeSpent) {
        const timeSpent = Math.round((Date.now() - slideStartTime.current) / 1000);
        if (timeSpent >= 2) {
          onSlideTimeSpent(lastTrackedSlide.current, timeSpent);
        }
      }
    };
  }, [onSlideTimeSpent]);
  return (
    <Card className="flex-1 flex flex-col p-6">
      <div className="flex-1 bg-muted rounded-md flex items-center justify-center mb-4">
        <div className="text-center space-y-4">
          <FileText className="w-16 h-16 text-muted-foreground mx-auto" />
          <p className="text-muted-foreground">
            Document viewer placeholder
          </p>
          <p className="text-sm text-muted-foreground">
            Slide {currentSlide} preview would appear here
          </p>
        </div>
      </div>

      {/* Slide navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={onPrevSlide}
          disabled={currentSlide === 1}
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </Button>
        <span className="text-sm text-muted-foreground">
          Slide {currentSlide} of {totalSlides}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={onNextSlide}
          disabled={currentSlide === totalSlides}
        >
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      <div className="flex items-center gap-2 mt-4">
        <Button variant="outline" size="sm">
          <ExternalLink className="w-4 h-4 mr-2" />
          Open in new tab
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="bg-[hsl(var(--gradient-blue))] text-white hover:bg-[hsl(var(--gradient-blue))]/90"
        >
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
      </div>
    </Card>
  );
}
