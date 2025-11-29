import { MoreVertical, ExternalLink, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { QuestionnaireResponsesTab } from "./QuestionnaireResponsesTab";
import { QuestionnaireShareTab } from "./QuestionnaireShareTab";
import type { Questionnaire, QuestionnaireAnalytics } from "@/types";

interface QuestionnaireDetailProps {
  questionnaire: Questionnaire;
  analytics: QuestionnaireAnalytics | null;
  onBack: () => void;
  onEdit: () => void;
  onToggleStatus: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

const formatDate = (isoDate: string) => {
  const date = new Date(isoDate);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return <Badge className="bg-[hsl(var(--sage-green))] text-white">Active</Badge>;
    case "draft":
      return <Badge className="bg-amber-500 text-white">Draft</Badge>;
    case "closed":
      return <Badge variant="secondary">Closed</Badge>;
    default:
      return null;
  }
};

export function QuestionnaireDetail({
  questionnaire: q,
  analytics,
  onBack,
  onEdit,
  onToggleStatus,
  onDuplicate,
  onDelete,
}: QuestionnaireDetailProps) {
  const completedCount = q.completions.filter((c) => c.completedAt !== null).length;
  const sentCount = q.completions.length;
  const completionRate = sentCount > 0 ? Math.round((completedCount / sentCount) * 100) : 0;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Button variant="ghost" onClick={onBack} className="mb-4">
        ← Back to Questionnaires
      </Button>

      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-[hsl(var(--bold-royal-blue))]">{q.title}</h1>
          {getStatusBadge(q.status)}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onEdit}>Edit</Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onToggleStatus}>
                {q.status === "closed" ? "Reopen" : "Close"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDuplicate}>Duplicate</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive" onClick={onDelete}>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="responses">Responses</TabsTrigger>
          <TabsTrigger value="share">Share</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold text-[hsl(var(--dark-grey))] mb-4">Details</h3>
            <div className="space-y-2 text-sm">
              <p className="text-[hsl(var(--medium-grey))]">{q.description}</p>
              <p className="text-[hsl(var(--medium-grey))]">Created: {formatDate(q.createdAt)}</p>
              <div className="flex items-center gap-2">
                <span className="text-[hsl(var(--medium-grey))]">Form link:</span>
                <a
                  href={q.formUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[hsl(var(--bold-royal-blue))] hover:underline flex items-center gap-1"
                >
                  {q.formUrl.slice(0, 40)}...
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <p className="text-sm text-[hsl(var(--medium-grey))] mb-1">Sent</p>
              <p className="text-2xl font-bold text-[hsl(var(--bold-royal-blue))]">{sentCount}</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-[hsl(var(--medium-grey))] mb-1">Completed</p>
              <p className="text-2xl font-bold text-[hsl(var(--bold-royal-blue))]">{completedCount}</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-[hsl(var(--medium-grey))] mb-1">Completion Rate</p>
              <p className="text-2xl font-bold text-[hsl(var(--bold-royal-blue))]">{completionRate}%</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-[hsl(var(--medium-grey))] mb-1">Avg. Time</p>
              <p className="text-2xl font-bold text-[hsl(var(--bold-royal-blue))]">
                {analytics?.avgCompletionTime ? `${Math.round(analytics.avgCompletionTime / 60)} min` : "N/A"}
              </p>
            </Card>
          </div>

          {analytics?.questionSummaries && analytics.questionSummaries.length > 0 && (
            <Card className="p-6 border-l-4 border-l-[hsl(var(--rich-violet))]">
              <h3 className="font-semibold text-[hsl(var(--dark-grey))] mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Key Insights from Responses
              </h3>
              <ul className="space-y-2 text-sm text-[hsl(var(--dark-grey))] list-disc list-inside">
                {analytics.questionSummaries.slice(0, 4).map((summary) => (
                  <li key={summary.questionId}>{summary.questionText}</li>
                ))}
              </ul>
              <Button variant="outline" className="mt-4">
                Generate Summary
              </Button>
            </Card>
          )}

          <Card className="p-6">
            <h3 className="font-semibold text-[hsl(var(--dark-grey))] mb-4">Client Hub Status</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[hsl(var(--dark-grey))]">Visible in client hub: {q.status === "active" ? "Yes" : "No"}</p>
                <p className="text-sm text-[hsl(var(--medium-grey))]">
                  {q.completions.length > 0
                    ? `Embedded form available for: ${q.completions.map((c) => c.userName).join(", ")}`
                    : "No recipients yet"}
                </p>
              </div>
              <Switch defaultChecked={q.status === "active"} />
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="responses">
          <QuestionnaireResponsesTab questionnaire={q} analytics={analytics} />
        </TabsContent>

        <TabsContent value="share">
          <QuestionnaireShareTab questionnaire={q} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
