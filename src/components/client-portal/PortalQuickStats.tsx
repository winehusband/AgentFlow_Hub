import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { EngagementStats } from "@/types";

interface PortalQuickStatsProps {
  stats: EngagementStats;
}

const formatRelativeTime = (isoDate: string | null) => {
  if (!isoDate) return "Never";
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours} hours ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} days ago`;
};

export function PortalQuickStats({ stats }: PortalQuickStatsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[hsl(var(--dark-grey))]">Quick Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-[hsl(var(--medium-grey))]">Portal views</span>
            <span className="font-semibold text-[hsl(var(--dark-grey))]">{stats.totalViews}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-[hsl(var(--medium-grey))]">Unique visitors</span>
            <span className="font-semibold text-[hsl(var(--dark-grey))]">{stats.uniqueVisitors}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-[hsl(var(--medium-grey))]">Last visit</span>
            <span className="font-semibold text-[hsl(var(--dark-grey))]">{formatRelativeTime(stats.lastVisit)}</span>
          </div>
          <div className="pt-2 border-t">
            <div className="text-sm text-[hsl(var(--medium-grey))] mb-1">Most viewed</div>
            <div className="font-semibold text-[hsl(var(--dark-grey))]">
              Proposal ({stats.proposalViews} views)
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
