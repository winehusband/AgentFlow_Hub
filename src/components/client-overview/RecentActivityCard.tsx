import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, FileText, Calendar, Mail, Video, Folder } from "lucide-react";
import type { ActivityFeedItem, ActivityType } from "@/types";

interface RecentActivityCardProps {
  activities: ActivityFeedItem[];
  onViewAll?: () => void;
}

const activityIcons: Record<ActivityType, typeof FileText> = {
  document_added: Folder,
  document_updated: Folder,
  video_added: Video,
  meeting_scheduled: Calendar,
  message_received: Mail,
  proposal_updated: FileText,
  questionnaire_added: FileText,
  member_joined: Mail,
};

export function RecentActivityCard({ activities, onViewAll }: RecentActivityCardProps) {
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString("en-GB", { month: "short", day: "numeric" });
  };

  if (activities.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-[hsl(var(--dark-grey))]">What's New</h2>
        <Card>
          <CardContent className="p-6 text-center text-[hsl(var(--medium-grey))]">
            No recent activity
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-[hsl(var(--dark-grey))]">What's New</h2>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {activities.slice(0, 5).map((activity) => {
              const Icon = activityIcons[activity.type] || FileText;
              return (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 pb-4 border-b last:border-b-0"
                >
                  <div className="p-2 rounded-lg bg-muted">
                    <Icon className="h-4 w-4 text-[hsl(var(--medium-grey))]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-[hsl(var(--dark-grey))]">
                      {activity.description}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <Clock className="h-3 w-3 text-[hsl(var(--medium-grey))]" />
                      <span className="text-xs text-[hsl(var(--medium-grey))]">
                        {formatTimestamp(activity.occurredAt)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {onViewAll && activities.length > 5 && (
            <Button
              variant="link"
              className="text-[hsl(var(--gradient-blue))] p-0 mt-4"
              onClick={onViewAll}
            >
              View all
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
