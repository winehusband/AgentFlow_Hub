import { FileText, Video, Folder, Mail, Calendar, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { PortalSectionConfig } from "@/types";

interface PortalSectionsConfigProps {
  sections: PortalSectionConfig;
  onToggle: (key: keyof PortalSectionConfig) => void;
}

const sectionMeta: Array<{ key: keyof PortalSectionConfig; name: string; icon: typeof FileText; description: string }> = [
  { key: "showProposal", name: "Proposal", icon: FileText, description: "Main proposal document" },
  { key: "showVideos", name: "Videos", icon: Video, description: "Video messages and demos" },
  { key: "showDocuments", name: "Documents", icon: Folder, description: "Shared files" },
  { key: "showMessages", name: "Messages", icon: Mail, description: "Always recommended" },
  { key: "showMeetings", name: "Meetings", icon: Calendar, description: "Scheduled meetings" },
  { key: "showQuestionnaire", name: "Questionnaire", icon: ClipboardList, description: "Forms and surveys" },
];

export function PortalSectionsConfig({ sections, onToggle }: PortalSectionsConfigProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[hsl(var(--dark-grey))]">What's Included</CardTitle>
        <CardDescription>Toggle which sections clients can see</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sectionMeta.map((section) => {
            const Icon = section.icon;
            return (
              <div key={section.key} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5 text-[hsl(var(--medium-grey))]" />
                  <div>
                    <div className="font-medium text-[hsl(var(--dark-grey))]">{section.name}</div>
                    <div className="text-sm text-[hsl(var(--medium-grey))]">{section.description}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="link" size="sm" className="text-[hsl(var(--gradient-blue))]">
                    Manage
                  </Button>
                  <Switch
                    checked={sections[section.key]}
                    onCheckedChange={() => onToggle(section.key)}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-sm text-[hsl(var(--medium-grey))] mt-4">
          Clients only see sections that are toggled on and have content
        </p>
      </CardContent>
    </Card>
  );
}
