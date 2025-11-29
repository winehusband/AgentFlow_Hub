import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Video, Users, Clock, Download, Plus, Loader2 } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useHubId } from "@/contexts/hub-context";
import { usePortalMeetings, useTrackEngagement } from "@/hooks";
import type { Meeting } from "@/types";

export function ClientMeetingsSection() {
  const hubId = useHubId();
  const { toast } = useToast();
  const [requestOpen, setRequestOpen] = useState(false);
  const [requestTopic, setRequestTopic] = useState("");
  const [requestTimes, setRequestTimes] = useState("");
  const [requestDuration, setRequestDuration] = useState("30");

  // Data hooks
  const { data: meetingsData, isLoading } = usePortalMeetings(hubId);

  // Engagement tracking
  const { trackHubViewed } = useTrackEngagement(hubId);

  useEffect(() => {
    trackHubViewed("portal-meetings");
  }, [trackHubViewed]);

  const meetings = meetingsData?.items || [];
  const now = new Date();
  const upcomingMeetings = meetings.filter((m) => new Date(m.startTime) > now && m.status !== "cancelled");
  const pastMeetings = meetings.filter((m) => new Date(m.endTime) < now);

  const handleRequestMeeting = () => {
    if (!requestTopic.trim()) {
      toast({ title: "Topic required", description: "Please describe what you'd like to discuss", variant: "destructive" });
      return;
    }
    toast({
      title: "Meeting request sent!",
      description: "The AgentFlow team will confirm a time soon.",
    });
    setRequestOpen(false);
    setRequestTopic("");
    setRequestTimes("");
  };

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const getDuration = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    return Math.round((end.getTime() - start.getTime()) / (1000 * 60));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-[hsl(var(--gradient-blue))]" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[hsl(var(--bold-royal-blue))] mb-2">Meetings</h1>
          <p className="text-[hsl(var(--medium-grey))]">Schedule and join calls with the AgentFlow team</p>
        </div>
        <Button onClick={() => setRequestOpen(true)} className="bg-[hsl(var(--soft-coral))] hover:bg-[hsl(var(--soft-coral))]/90 text-white">
          <Plus className="mr-2 h-4 w-4" />
          Request Meeting
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList>
          <TabsTrigger value="upcoming">
            Upcoming <span className="ml-2 px-2 py-0.5 rounded-full bg-[hsl(var(--gradient-blue))] text-white text-xs">{upcomingMeetings.length}</span>
          </TabsTrigger>
          <TabsTrigger value="past">
            Past Meetings <span className="ml-2 px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs">{pastMeetings.length}</span>
          </TabsTrigger>
        </TabsList>

        {/* Upcoming */}
        <TabsContent value="upcoming" className="mt-6">
          <div className="space-y-4">
            {upcomingMeetings.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Calendar className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-muted-foreground">No upcoming meetings</p>
                </CardContent>
              </Card>
            ) : (
              upcomingMeetings.map((meeting) => (
                <Card key={meeting.id} className="border-l-4 border-[hsl(var(--soft-coral))]">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-[hsl(var(--dark-grey))] mb-2">{meeting.title}</h3>
                    <div className="space-y-2 text-sm text-[hsl(var(--medium-grey))] mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDateTime(meeting.startTime)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{getDuration(meeting.startTime, meeting.endTime)} minutes</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Video className="h-4 w-4" />
                        <span>Microsoft Teams</span>
                      </div>
                    </div>
                    {meeting.joinUrl && (
                      <Button
                        className="bg-[hsl(var(--gradient-blue))] hover:bg-[hsl(var(--gradient-blue))]/90"
                        onClick={() => window.open(meeting.joinUrl!, "_blank")}
                      >
                        <Video className="mr-2 h-4 w-4" />
                        Join Meeting
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Past */}
        <TabsContent value="past" className="mt-6">
          <div className="space-y-4">
            {pastMeetings.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Calendar className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-muted-foreground">No past meetings</p>
                </CardContent>
              </Card>
            ) : (
              pastMeetings.map((meeting) => (
                <Card key={meeting.id} className="border-l-4 border-[hsl(var(--rich-violet))]">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-[hsl(var(--dark-grey))] mb-2">{meeting.title}</h3>
                    <div className="space-y-2 text-sm text-[hsl(var(--medium-grey))] mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDateTime(meeting.startTime)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{getDuration(meeting.startTime, meeting.endTime)} minutes</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>{[meeting.organizer, ...meeting.attendees].map(p => p.name).join(", ")}</span>
                      </div>
                    </div>

                    {/* Recording */}
                    {meeting.recording && (
                      <div className="mb-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(meeting.recording!.recordingUrl, "_blank")}
                        >
                          <Video className="mr-2 h-4 w-4" />
                          Watch Recording ({Math.floor(meeting.recording.duration / 60)} min)
                        </Button>
                      </div>
                    )}

                    {/* AI Summary (client-visible) */}
                    {meeting.aiSummary && (
                      <Collapsible>
                        <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium text-[hsl(var(--gradient-blue))] hover:underline">
                          <Download className="h-4 w-4" />
                          View Meeting Summary
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-3">
                          <div className="p-4 bg-[hsl(var(--warm-cream))] rounded-lg border-l-4 border-[hsl(var(--rich-violet))] text-sm whitespace-pre-line text-[hsl(var(--dark-grey))]">
                            {meeting.aiSummary}
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Request Meeting Modal */}
      <Dialog open={requestOpen} onOpenChange={setRequestOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Request a Meeting</DialogTitle>
            <p className="text-sm text-[hsl(var(--medium-grey))]">The AgentFlow team will get back to you to confirm</p>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="request-topic">What would you like to discuss?</Label>
              <Textarea id="request-topic" placeholder="e.g., Questions about the proposal..." value={requestTopic} onChange={(e) => setRequestTopic(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="request-times">Preferred times (optional)</Label>
              <Textarea id="request-times" placeholder="e.g., Tuesday afternoon, or any time Thursday" value={requestTimes} onChange={(e) => setRequestTimes(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="request-duration">Duration</Label>
              <Select value={requestDuration} onValueChange={setRequestDuration}>
                <SelectTrigger id="request-duration">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setRequestOpen(false)}>Cancel</Button>
            <Button onClick={handleRequestMeeting} className="bg-[hsl(var(--gradient-blue))] hover:bg-[hsl(var(--gradient-blue))]/90">Send Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
