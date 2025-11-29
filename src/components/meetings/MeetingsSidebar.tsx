import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Meeting, MeetingParticipant } from "@/types";

interface MeetingsSidebarProps {
  upcomingMeetings: Meeting[];
  pastMeetings: Meeting[];
}

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const formatDuration = (startTime: string, endTime: string) => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  return Math.round((end.getTime() - start.getTime()) / (1000 * 60));
};

interface ParticipantSummary {
  name: string;
  email: string;
  meetingCount: number;
}

export function MeetingsSidebar({ upcomingMeetings, pastMeetings }: MeetingsSidebarProps) {
  const allMeetings = [...upcomingMeetings, ...pastMeetings];

  // Calculate total meeting time
  const totalMinutes = pastMeetings.reduce((sum, meeting) => {
    return sum + formatDuration(meeting.startTime, meeting.endTime);
  }, 0);

  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;
  const totalTimeStr = totalHours > 0
    ? `${totalHours}h ${remainingMinutes}m`
    : `${totalMinutes}m`;

  // Count recordings
  const recordingsCount = pastMeetings.filter((m) => m.recording).length;

  // Get unique client participants with meeting counts
  const participantMap = new Map<string, ParticipantSummary>();
  allMeetings.forEach((meeting) => {
    const clientParticipants = [meeting.organizer, ...meeting.attendees].filter((p) => p.isClient);
    clientParticipants.forEach((p) => {
      const existing = participantMap.get(p.email);
      if (existing) {
        existing.meetingCount++;
      } else {
        participantMap.set(p.email, {
          name: p.name,
          email: p.email,
          meetingCount: 1,
        });
      }
    });
  });

  const clientParticipants = Array.from(participantMap.values())
    .sort((a, b) => b.meetingCount - a.meetingCount);

  return (
    <div className="w-80 space-y-6">
      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quick Stats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span style={{ color: "hsl(var(--medium-grey))" }}>Upcoming meetings:</span>
            <span className="font-medium">{upcomingMeetings.length}</span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: "hsl(var(--medium-grey))" }}>Past meetings:</span>
            <span className="font-medium">{pastMeetings.length}</span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: "hsl(var(--medium-grey))" }}>Total meeting time:</span>
            <span className="font-medium">{totalTimeStr}</span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: "hsl(var(--medium-grey))" }}>Recordings available:</span>
            <span className="font-medium">{recordingsCount}</span>
          </div>
        </CardContent>
      </Card>

      {/* Attendee Summary */}
      {clientParticipants.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Attendee Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {clientParticipants.map((participant) => (
              <div key={participant.email} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{getInitials(participant.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-sm">{participant.name}</div>
                    <div className="text-xs" style={{ color: "hsl(var(--medium-grey))" }}>
                      {participant.meetingCount} meeting{participant.meetingCount !== 1 ? "s" : ""}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
