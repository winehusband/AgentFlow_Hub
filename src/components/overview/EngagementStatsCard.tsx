import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { EngagementStats } from "@/types";

interface EngagementStatsCardProps {
  stats: EngagementStats;
}

const formatTimeAgo = (isoDate: string | null) => {
  if (!isoDate) return "Never";
  const now = new Date();
  const date = new Date(isoDate);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString();
};

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  return `~${mins} min`;
};

export function EngagementStatsCard({ stats }: EngagementStatsCardProps) {
  const formattedStats = [
    { label: "Total hub visits", value: stats.totalViews.toString() },
    { label: "Last visit", value: formatTimeAgo(stats.lastVisit) },
    { label: "Proposal views", value: stats.proposalViews.toString() },
    { label: "Unique visitors", value: stats.uniqueVisitors.toString() },
    { label: "Documents downloaded", value: stats.documentDownloads.toString() },
    { label: "Avg. time per visit", value: formatDuration(stats.avgTimeSpent) },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg text-[hsl(var(--dark-grey))]">
          Client Engagement
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {formattedStats.map((stat, index) => (
            <div
              key={index}
              className="flex justify-between items-center py-2 border-b last:border-b-0"
            >
              <span className="text-sm text-[hsl(var(--dark-grey))]">
                {stat.label}
              </span>
              <span className="text-sm font-semibold text-[hsl(var(--bold-royal-blue))]">
                {stat.value}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
