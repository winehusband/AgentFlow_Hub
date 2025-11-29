import { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, ChevronLeft, ChevronRight, MessageSquare } from "lucide-react";

interface ProposalSlideViewerProps {
  currentSlide: number;
  totalSlides: number;
  onPrevSlide: () => void;
  onNextSlide: () => void;
  onSlideComment: (slideNum: number) => void;
  onSlideTimeSpent?: (slideNum: number, seconds: number) => void;
  commentedSlides?: number[];
}

export function ProposalSlideViewer({
  currentSlide,
  totalSlides,
  onPrevSlide,
  onNextSlide,
  onSlideComment,
  onSlideTimeSpent,
  commentedSlides = [],
}: ProposalSlideViewerProps) {
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

  const hasComments = commentedSlides.includes(currentSlide);

  return (
    <Card className="flex-1 flex flex-col">
      {/* Slide Preview */}
      <div className="flex-1 bg-muted flex items-center justify-center p-8 relative min-h-[400px]">
        <div className="text-center space-y-4">
          <FileText className="w-20 h-20 text-muted-foreground mx-auto" />
          <p className="text-muted-foreground text-lg">Slide {currentSlide} Preview</p>
          <p className="text-sm text-muted-foreground">
            Document viewer placeholder — slide content would appear here
          </p>
        </div>

        {/* Slide comment indicator */}
        {hasComments && (
          <div className="absolute top-4 right-4 bg-[hsl(var(--gradient-blue))] text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <MessageSquare className="h-3 w-3" />
            Has comments
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="p-4 border-t flex items-center justify-between">
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

      {/* Comment on this slide */}
      <div className="p-4 border-t">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onSlideComment(currentSlide)}
          className="w-full text-[hsl(var(--gradient-blue))] hover:text-[hsl(var(--gradient-blue))] hover:bg-[hsl(var(--gradient-blue))]/10"
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Comment on this slide
        </Button>
      </div>
    </Card>
  );
}
