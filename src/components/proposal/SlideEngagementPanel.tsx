import { BarChart3 } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { ProposalEngagement } from "@/types";

interface SlideEngagementPanelProps {
  engagement: ProposalEngagement | undefined;
}

const formatDuration = (seconds: number) => {
  if (seconds < 60) return `${seconds} sec`;
  return `~${Math.floor(seconds / 60)} min`;
};

export function SlideEngagementPanel({ engagement }: SlideEngagementPanelProps) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-4 h-4 text-muted-foreground" />
        <h3 className="font-semibold text-[hsl(var(--dark-grey))]">
          Slide Engagement
        </h3>
      </div>
      <div className="space-y-2">
        {engagement?.slideViews && engagement.slideViews.length > 0 ? (
          <>
            {engagement.slideViews.map((slide) => {
              const isMostViewed = slide.slideNumber === engagement.mostViewedSlide;
              return (
                <div
                  key={slide.slideNumber}
                  className={`flex items-center justify-between text-sm ${
                    isMostViewed ? "bg-[hsl(var(--sage-green))]/10 p-2 rounded" : ""
                  }`}
                >
                  <span className={isMostViewed ? "font-medium" : "text-muted-foreground"}>
                    Slide {slide.slideNumber}{slide.title ? ` (${slide.title})` : ""}
                  </span>
                  <span className={isMostViewed ? "font-semibold" : "text-muted-foreground"}>
                    {formatDuration(slide.timeSpent)}
                  </span>
                </div>
              );
            })}
            {engagement.mostViewedSlide && (
              <p className="text-xs text-muted-foreground italic mt-3">
                Most viewed: Slide {engagement.mostViewedSlide}
              </p>
            )}
          </>
        ) : (
          <p className="text-sm text-muted-foreground italic">
            No slide engagement data yet
          </p>
        )}
      </div>
    </Card>
  );
}
