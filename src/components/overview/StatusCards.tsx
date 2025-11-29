import { Users, Clock, Folder, ClipboardPlus, type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Hub, EngagementStats } from "@/types";

interface StatusCardsProps {
  hub: Hub;
  engagementStats: EngagementStats;
}

interface StatusCard {
  label: string;
  value: string;
  icon: LucideIcon;
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

export function StatusCards({ hub, engagementStats }: StatusCardsProps) {
  const cards: StatusCard[] = [
    {
      label: "Clients Invited",
      value: hub.clientsInvited.toString(),
      icon: Users,
    },
    {
      label: "Last Client Visit",
      value: formatTimeAgo(hub.lastVisit),
      icon: Clock,
    },
    {
      label: "Total Views",
      value: engagementStats.totalViews.toString(),
      icon: Folder,
    },
    {
      label: "Proposal Views",
      value: engagementStats.proposalViews.toString(),
      icon: ClipboardPlus,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((status) => (
        <Card key={status.label} className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <status.icon className="w-6 h-6 text-[hsl(var(--gradient-blue))]" />
              <div className="flex-1">
                <p className="text-sm text-[hsl(var(--medium-grey))] mb-1">
                  {status.label}
                </p>
                <p className="text-xl font-bold text-[hsl(var(--bold-royal-blue))]">
                  {status.value}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
