import { useState } from "react";
import { Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ScheduleMeetingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (data: {
    title: string;
    startTime: string;
    endTime: string;
    attendeeEmails: string[];
    agenda?: string;
  }) => void;
  isScheduling: boolean;
  defaultAttendees?: string;
}

export function ScheduleMeetingDialog({
  isOpen,
  onClose,
  onSchedule,
  isScheduling,
  defaultAttendees = "",
}: ScheduleMeetingDialogProps) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("14:00");
  const [duration, setDuration] = useState("30");
  const [attendees, setAttendees] = useState(defaultAttendees);
  const [agenda, setAgenda] = useState("");

  const handleSubmit = () => {
    if (!title || !date || !time) return;

    const startTime = new Date(`${date}T${time}`);
    const endTime = new Date(startTime.getTime() + parseInt(duration) * 60 * 1000);

    onSchedule({
      title,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      attendeeEmails: attendees.split(",").map((e) => e.trim()).filter(Boolean),
      agenda: agenda || undefined,
    });

    // Reset form
    setTitle("");
    setDate("");
    setTime("14:00");
    setDuration("30");
    setAttendees(defaultAttendees);
    setAgenda("");
  };

  const handleClose = () => {
    setTitle("");
    setDate("");
    setTime("14:00");
    setDuration("30");
    setAttendees(defaultAttendees);
    setAgenda("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Schedule Meeting</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div>
            <Label>Meeting Title</Label>
            <Input
              placeholder="e.g., Proposal Review Call"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Date</Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div>
              <Label>Time (GMT)</Label>
              <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
            </div>
          </div>

          <div>
            <Label>Duration</Label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="45">45 minutes</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
                <SelectItem value="90">1.5 hours</SelectItem>
                <SelectItem value="120">2 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Attendees (comma-separated emails)</Label>
            <Input
              placeholder="sarah@example.com, james@example.com"
              value={attendees}
              onChange={(e) => setAttendees(e.target.value)}
            />
            <Button variant="outline" size="sm" className="mt-2">
              Add AgentFlow team
            </Button>
          </div>

          <div>
            <Label>Agenda (optional)</Label>
            <Textarea
              placeholder="Add agenda items..."
              rows={4}
              value={agenda}
              onChange={(e) => setAgenda(e.target.value)}
            />
            <p className="text-xs mt-1" style={{ color: "hsl(var(--medium-grey))" }}>
              This will be included in the calendar invite
            </p>
          </div>

          <div className="flex items-center gap-2 pt-4 border-t">
            <Video className="h-4 w-4" style={{ color: "hsl(var(--medium-grey))" }} />
            <span className="text-sm" style={{ color: "hsl(var(--medium-grey))" }}>
              Invite will be sent via Outlook
            </span>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              style={{ backgroundColor: "hsl(var(--gradient-blue))" }}
              className="text-white"
              onClick={handleSubmit}
              disabled={!title || !date || !time || isScheduling}
            >
              {isScheduling ? "Sending..." : "Send Invite"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
