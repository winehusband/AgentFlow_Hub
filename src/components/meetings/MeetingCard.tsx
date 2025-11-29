import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Calendar,
  Video,
  Users,
  Clock,
  ChevronDown,
  Link as LinkIcon,
  Bell,
} from "lucide-react";
import type { Meeting } from "@/types";

interface MeetingCardProps {
  meeting: Meeting;
  isHighlighted?: boolean;
  onJoin: () => void;
  onEditAgenda: () => void;
  onEdit: () => void;
  onCancel: () => void;
  onCopyLink: () => void;
  onSendReminder: () => void;
}

const formatDate = (isoDate: string) => {
  const date = new Date(isoDate);
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const isToday = date.toDateString() === now.toDateString();
  const isTomorrow = date.toDateString() === tomorrow.toDateString();

  const timeStr = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });

  if (isToday) return `Today at ${timeStr}`;
  if (isTomorrow) return `Tomorrow, ${date.toLocaleDateString("en-US", { month: "short", day: "numeric" })} at ${timeStr}`;
  return `${date.toLocaleDateString("en-US", { month: "short", day: "numeric" })} at ${timeStr}`;
};

const formatDuration = (startTime: string, endTime: string) => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const durationMinutes = Math.round((end.getTime() - start.getTime()) / (1000 * 60));
  if (durationMinutes < 60) return `${durationMinutes} minutes`;
  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;
  return minutes > 0 ? `${hours}h ${minutes}m` : `${hours} hour${hours > 1 ? "s" : ""}`;
};

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export function MeetingCard({
  meeting,
  isHighlighted = false,
  onJoin,
  onEditAgenda,
  onEdit,
  onCancel,
  onCopyLink,
  onSendReminder,
}: MeetingCardProps) {
  const allParticipants = [meeting.organizer, ...meeting.attendees];

  return (
    <Card
      className="border-l-4"
      style={{ borderLeftColor: isHighlighted ? "hsl(var(--soft-coral))" : "hsl(var(--border))" }}
    >
      <CardHeader>
        <CardTitle className="text-xl" style={{ color: "hsl(var(--dark-grey))" }}>
          {meeting.title}
        </CardTitle>
        <div className="space-y-2 text-sm" style={{ color: "hsl(var(--medium-grey))" }}>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className={isHighlighted ? "font-medium" : ""}>{formatDate(meeting.startTime)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{formatDuration(meeting.startTime, meeting.endTime)}</span>
          </div>
          {meeting.joinUrl && (
            <div className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              <span>Microsoft Teams</span>
            </div>
          )}
          <div className="flex items-center gap-3 mt-3">
            <Users className="h-4 w-4" />
            <div className="flex items-center gap-2">
              {allParticipants.slice(0, 4).map((participant) => (
                <Avatar key={participant.email} className="h-6 w-6">
                  <AvatarFallback className="text-xs">{getInitials(participant.name)}</AvatarFallback>
                </Avatar>
              ))}
              <span className="text-sm ml-1">
                {allParticipants.map((p) => p.name.split(" ")[0]).join(", ")}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {meeting.joinUrl && (
          <Button className="w-full" style={{ backgroundColor: "hsl(var(--gradient-blue))" }} onClick={onJoin}>
            Join Meeting
          </Button>
        )}

        {/* Agenda Section */}
        {meeting.agenda && (
          <Collapsible>
            <CollapsibleTrigger className="flex items-center justify-between w-full py-2 hover:bg-muted/50 px-2 rounded">
              <span className="font-medium">Agenda</span>
              <ChevronDown className="h-4 w-4" />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2 px-2">
              <div
                className="text-sm whitespace-pre-line"
                style={{ color: "hsl(var(--dark-grey))" }}
              >
                {meeting.agenda}
              </div>
              <Button variant="link" size="sm" className="px-0 mt-2" onClick={onEditAgenda}>
                Edit Agenda
              </Button>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Meeting Details */}
        <Collapsible>
          <CollapsibleTrigger className="flex items-center justify-between w-full py-2 hover:bg-muted/50 px-2 rounded">
            <span className="font-medium">Meeting Details</span>
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2 px-2 space-y-2 text-sm">
            <div>
              <span style={{ color: "hsl(var(--medium-grey))" }}>Responses: </span>
              {meeting.attendees.map((a) => `${a.name.split(" ")[0]}: ${a.responseStatus}`).join(", ")}
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="link" size="sm" className="px-0 h-auto" onClick={onEdit}>
                Edit Meeting
              </Button>
              <Button variant="link" size="sm" className="px-0 h-auto text-destructive" onClick={onCancel}>
                Cancel Meeting
              </Button>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Actions */}
        <div className="flex gap-3 pt-2 border-t text-sm">
          <Button variant="link" size="sm" className="px-0" onClick={onCopyLink}>
            <LinkIcon className="h-3 w-3 mr-1" />
            Copy Join Link
          </Button>
          <Button variant="link" size="sm" className="px-0" onClick={onSendReminder}>
            <Bell className="h-3 w-3 mr-1" />
            Send Reminder
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
