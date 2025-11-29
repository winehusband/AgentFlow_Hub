import { useState } from "react";
import { EyeOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface InternalNotesProps {
  notes: string;
  onSave: (notes: string) => void;
  isSaving: boolean;
}

export function InternalNotes({ notes, onSave, isSaving }: InternalNotesProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedNotes, setEditedNotes] = useState("");

  const handleEdit = () => {
    setEditedNotes(notes);
    setIsEditing(true);
  };

  const handleSave = () => {
    onSave(editedNotes);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <Card className="bg-[hsl(var(--warm-cream))]/50 border-2 border-[hsl(var(--medium-grey))]/20">
      <CardHeader>
        <div className="flex items-center gap-2 mb-1">
          <EyeOff className="w-4 h-4" />
          <CardTitle className="text-lg">Internal Notes</CardTitle>
        </div>
        <p className="text-xs text-[hsl(var(--medium-grey))]">
          Only visible to AgentFlow team
        </p>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <>
            <Textarea
              value={editedNotes}
              onChange={(e) => setEditedNotes(e.target.value)}
              className="min-h-[180px] mb-3"
              placeholder="Add internal notes..."
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={handleCancel}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                className="flex-1 bg-[hsl(var(--gradient-blue))] hover:bg-[hsl(var(--gradient-blue))]/90"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="bg-white/50 p-4 rounded-md border border-[hsl(var(--medium-grey))]/20 min-h-[180px] text-sm text-[hsl(var(--dark-grey))] whitespace-pre-line mb-3">
              {notes || "No notes yet. Click Edit to add notes."}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={handleEdit}
            >
              Edit
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
