import { Eye } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { ProposalEngagement } from "@/types";

interface ClientEngagementPanelProps {
  engagement: ProposalEngagement | undefined;
}

const formatTimeAgo = (isoDate: string) => {
  const now = new Date();
  const date = new Date(isoDate);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays === 1) return "Yesterday";
  return `${diffDays} days ago`;
};

const formatDuration = (seconds: number) => {
  if (seconds < 60) return `${seconds} sec`;
  return `~${Math.floor(seconds / 60)} min`;
};

export function ClientEngagementPanel({ engagement }: ClientEngagementPanelProps) {
  return (
    <Card className="p-4">
      <h3 className="font-semibold text-[hsl(var(--dark-grey))] mb-4">
        Client Engagement
      </h3>
      <div className="space-y-3">
        {engagement?.viewers && engagement.viewers.length > 0 && (
          <>
            <div className="flex items-start gap-2">
              <Eye className="w-4 h-4 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-foreground">Viewed by:</p>
                <p className="text-sm text-muted-foreground">
                  {engagement.viewers.map((v) => v.name).join(", ")}
                </p>
              </div>
            </div>
            <Separator />
          </>
        )}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Total views:</span>
          <span className="font-semibold">{engagement?.totalViews ?? 0}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Last viewed:</span>
          <span className="text-sm">
            {engagement?.lastViewedAt ? formatTimeAgo(engagement.lastViewedAt) : "Never"}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Time spent:</span>
          <span className="text-sm">
            {engagement?.totalTimeSpent ? formatDuration(engagement.totalTimeSpent) : "—"}
          </span>
        </div>
      </div>
    </Card>
  );
}
