import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import type { LinkQuestionnaireRequest, QuestionnaireStatus } from "@/types";

interface AddQuestionnaireDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: LinkQuestionnaireRequest & { status?: QuestionnaireStatus }) => void;
  isAdding: boolean;
}

export function AddQuestionnaireDialog({ isOpen, onClose, onAdd, isAdding }: AddQuestionnaireDialogProps) {
  const [linkType, setLinkType] = useState<"existing" | "new">("existing");
  const [formUrl, setFormUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<QuestionnaireStatus>("draft");
  const [showInHub, setShowInHub] = useState(false);

  const handleSubmit = () => {
    if (!formUrl.trim() || !title.trim()) return;
    onAdd({ formUrl, title, description: description || undefined });
  };

  const handleClose = () => {
    setFormUrl("");
    setTitle("");
    setDescription("");
    setStatus("draft");
    setShowInHub(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-[hsl(var(--bold-royal-blue))]">Add Questionnaire</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <Tabs value={linkType} onValueChange={(v) => setLinkType(v as "existing" | "new")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="existing">Link Existing Form</TabsTrigger>
              <TabsTrigger value="new">Create New Form</TabsTrigger>
            </TabsList>

            <TabsContent value="existing" className="space-y-4 mt-6">
              <p className="text-sm text-[hsl(var(--medium-grey))]">
                Already created a form in Microsoft Forms? Paste the link here.
              </p>
              <div className="flex gap-2">
                <Input
                  placeholder="Paste Microsoft Forms link..."
                  className="flex-1"
                  value={formUrl}
                  onChange={(e) => setFormUrl(e.target.value)}
                />
                <Button variant="outline">Fetch Details</Button>
              </div>
            </TabsContent>

            <TabsContent value="new" className="space-y-4 mt-6">
              <p className="text-sm text-[hsl(var(--medium-grey))]">Create a new form in Microsoft Forms</p>
              <Button variant="outline" className="w-full" asChild>
                <a href="https://forms.microsoft.com" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open Microsoft Forms
                </a>
              </Button>
              <p className="text-sm text-[hsl(var(--medium-grey))]">Once created, paste the link above</p>
            </TabsContent>
          </Tabs>

          <Separator />

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-[hsl(var(--dark-grey))] block mb-2">Title</label>
              <Input
                placeholder="AI Readiness Assessment"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-[hsl(var(--dark-grey))] block mb-2">Description</label>
              <Textarea
                placeholder="What's this questionnaire for? (internal note)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-[hsl(var(--dark-grey))] block mb-2">Status</label>
              <Select value={status} onValueChange={(v) => setStatus(v as QuestionnaireStatus)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium text-[hsl(var(--dark-grey))]">Show in client hub</p>
                <p className="text-sm text-[hsl(var(--medium-grey))]">
                  Clients can complete this form directly in their hub
                </p>
              </div>
              <Switch checked={showInHub} onCheckedChange={setShowInHub} />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              className="bg-[hsl(var(--gradient-blue))] hover:bg-[hsl(var(--gradient-blue))]/90 text-white"
              onClick={handleSubmit}
              disabled={!formUrl.trim() || !title.trim() || isAdding}
            >
              {isAdding ? "Adding..." : "Add Questionnaire"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
