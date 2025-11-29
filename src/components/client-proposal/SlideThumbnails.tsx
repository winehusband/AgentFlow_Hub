import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface SlideThumbnailsProps {
  totalSlides: number;
  currentSlide: number;
  commentedSlides: number[];
  onSlideSelect: (slideNum: number) => void;
}

export function SlideThumbnails({
  totalSlides,
  currentSlide,
  commentedSlides,
  onSlideSelect,
}: SlideThumbnailsProps) {
  const slides = Array.from({ length: totalSlides }, (_, i) => i + 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Slides</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 max-h-[500px] overflow-y-auto">
        {slides.map((slideNum) => {
          const hasComment = commentedSlides.includes(slideNum);
          const isActive = currentSlide === slideNum;

          return (
            <button
              key={slideNum}
              onClick={() => onSlideSelect(slideNum)}
              className={cn(
                "w-full p-2 rounded-lg border text-left transition-colors flex items-center justify-between",
                isActive
                  ? "border-[hsl(var(--gradient-blue))] bg-[hsl(var(--gradient-blue))]/5"
                  : "border-muted hover:bg-muted/50"
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-12 h-9 rounded bg-muted flex items-center justify-center text-xs",
                    isActive && "bg-[hsl(var(--gradient-blue))]/20"
                  )}
                >
                  {slideNum}
                </div>
                <span
                  className={cn(
                    "text-sm",
                    isActive
                      ? "text-[hsl(var(--gradient-blue))] font-medium"
                      : "text-[hsl(var(--dark-grey))]"
                  )}
                >
                  Slide {slideNum}
                </span>
              </div>
              {hasComment && (
                <MessageSquare className="h-4 w-4 text-[hsl(var(--gradient-blue))]" />
              )}
            </button>
          );
        })}
      </CardContent>
    </Card>
  );
}
