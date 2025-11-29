import { CheckCircle2, Circle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { PortalConfig, HubMember } from "@/types";

interface PublishingChecklistProps {
  config: PortalConfig;
  members: HubMember[];
  hasProposal: boolean;
  hasQuestionnaire: boolean;
}

export function PublishingChecklist({ config, members, hasProposal, hasQuestionnaire }: PublishingChecklistProps) {
  const clientMembers = members.filter((m) => m.role === "client");

  const checklistItems = [
    { text: "Welcome message set", completed: !!config.welcomeHeadline && !!config.welcomeMessage },
    { text: "Hero content selected", completed: config.heroContentType !== "none" },
    { text: "Proposal uploaded", completed: hasProposal },
    { text: "At least one client invited", completed: clientMembers.length > 0 },
    { text: "Questionnaire created (optional)", completed: hasQuestionnaire },
  ];

  const completedCount = checklistItems.filter((item) => item.completed).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[hsl(var(--dark-grey))]">Publishing Checklist</CardTitle>
        <CardDescription>
          {completedCount} of {checklistItems.length} complete
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {checklistItems.map((item, idx) => (
            <div key={idx} className="flex items-start gap-2">
              {item.completed ? (
                <CheckCircle2 className="h-5 w-5 text-[hsl(var(--sage-green))] shrink-0 mt-0.5" />
              ) : (
                <Circle className="h-5 w-5 text-[hsl(var(--medium-grey))] shrink-0 mt-0.5" />
              )}
              <span
                className={`text-sm ${
                  item.completed ? "text-[hsl(var(--dark-grey))]" : "text-[hsl(var(--medium-grey))]"
                }`}
              >
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
