import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Calendar,
  Clock,
  ChevronDown,
  Play,
  Download,
  FileText,
  Sparkles,
  EyeOff,
  Video,
  Users,
} from "lucide-react";
import type { Meeting } from "@/types";

interface PastMeetingCardProps {
  meeting: Meeting;
  onSaveNotes: (notes: string) => void;
  isSavingNotes: boolean;
}

const formatDate = (isoDate: string) => {
  const date = new Date(isoDate);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const formatDuration = (startTime: string, endTime: string) => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const durationMinutes = Math.round((end.getTime() - start.getTime()) / (1000 * 60));
  return `${durationMinutes} minutes`;
};

const formatRecordingDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export function PastMeetingCard({ meeting, onSaveNotes, isSavingNotes }: PastMeetingCardProps) {
  const [editedNotes, setEditedNotes] = useState(meeting.teamNotes || "");

  const allParticipants = [meeting.organizer, ...meeting.attendees];

  return (
    <Card className="border-l-4" style={{ borderLeftColor: "hsl(var(--rich-violet))" }}>
      <CardHeader>
        <CardTitle className="text-xl" style={{ color: "hsl(var(--dark-grey))" }}>
          {meeting.title}
        </CardTitle>
        <div className="space-y-2 text-sm" style={{ color: "hsl(var(--medium-grey))" }}>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(meeting.startTime)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{formatDuration(meeting.startTime, meeting.endTime)}</span>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <Users className="h-4 w-4" />
            <span className="text-sm">{allParticipants.map((p) => p.name).join(", ")}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Recording Section */}
        {meeting.recording && (
          <Collapsible>
            <CollapsibleTrigger className="flex items-center justify-between w-full py-2 hover:bg-muted/50 px-2 rounded">
              <div className="flex items-center gap-2">
                <Play className="h-4 w-4" />
                <span className="font-medium">Recording</span>
              </div>
              <ChevronDown className="h-4 w-4" />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-3 px-2 space-y-3">
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Play className="h-12 w-12 mx-auto mb-2" style={{ color: "hsl(var(--medium-grey))" }} />
                  <span className="text-sm" style={{ color: "hsl(var(--medium-grey))" }}>
                    {formatRecordingDuration(meeting.recording.duration)}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex gap-3">
                  <Button variant="link" size="sm" className="px-0 h-auto" asChild>
                    <a href={meeting.recording.recordingUrl} target="_blank" rel="noopener noreferrer">
                      <Video className="h-3 w-3 mr-1" />
                      Open in Teams
                    </a>
                  </Button>
                  <Button variant="link" size="sm" className="px-0 h-auto" asChild>
                    <a href={meeting.recording.recordingUrl} download>
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </a>
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <EyeOff className="h-4 w-4" style={{ color: "hsl(var(--medium-grey))" }} />
                  <span style={{ color: "hsl(var(--medium-grey))" }}>Not visible to client</span>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Transcript Section */}
        {meeting.transcript && (
          <Collapsible>
            <CollapsibleTrigger className="flex items-center justify-between w-full py-2 hover:bg-muted/50 px-2 rounded">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span className="font-medium">Transcript</span>
              </div>
              <ChevronDown className="h-4 w-4" />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-3 px-2 space-y-3">
              <Input placeholder="Search transcript..." />
              <div
                className="max-h-48 overflow-y-auto p-3 bg-muted/30 rounded text-sm space-y-2"
                style={{ color: "hsl(var(--dark-grey))" }}
              >
                {meeting.transcript.segments.slice(0, 4).map((segment, index) => (
                  <p key={index}>
                    <strong>{segment.speakerName}:</strong> {segment.text}
                  </p>
                ))}
              </div>
              <Button variant="link" size="sm" className="px-0">
                <Download className="h-3 w-3 mr-1" />
                Download Transcript
              </Button>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* AI Summary Section */}
        {meeting.aiSummary && (
          <Collapsible defaultOpen>
            <CollapsibleTrigger className="flex items-center justify-between w-full py-2 hover:bg-muted/50 px-2 rounded">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" style={{ color: "hsl(var(--rich-violet))" }} />
                <span className="font-medium">AI Summary</span>
              </div>
              <ChevronDown className="h-4 w-4" />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-3 px-2">
              <div className="text-xs mb-2" style={{ color: "hsl(var(--medium-grey))" }}>
                Generated by Teams
              </div>
              <div
                className="p-4 rounded-lg border-l-4 whitespace-pre-line text-sm"
                style={{
                  backgroundColor: "hsl(var(--warm-cream))",
                  borderLeftColor: "hsl(var(--rich-violet))",
                  color: "hsl(var(--dark-grey))",
                }}
              >
                {meeting.aiSummary}
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Notes Section */}
        <Collapsible>
          <CollapsibleTrigger className="flex items-center justify-between w-full py-2 hover:bg-muted/50 px-2 rounded">
            <div className="flex items-center gap-2">
              <EyeOff className="h-4 w-4" />
              <span className="font-medium">Meeting Notes</span>
              <span className="text-xs" style={{ color: "hsl(var(--medium-grey))" }}>
                Internal only
              </span>
            </div>
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-3 px-2 space-y-2">
            <Textarea
              rows={6}
              value={editedNotes}
              onChange={(e) => setEditedNotes(e.target.value)}
              placeholder="Add meeting notes..."
            />
            <div className="flex justify-end">
              <Button
                size="sm"
                style={{ backgroundColor: "hsl(var(--gradient-blue))" }}
                onClick={() => onSaveNotes(editedNotes)}
                disabled={isSavingNotes}
              >
                {isSavingNotes ? "Saving..." : "Save Notes"}
              </Button>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Minimal view for meetings without recording */}
        {!meeting.recording && !meeting.transcript && (
          <div className="text-sm" style={{ color: "hsl(var(--medium-grey))" }}>
            <FileText className="h-4 w-4 inline mr-2" />
            No recording available
          </div>
        )}
      </CardContent>
    </Card>
  );
}
