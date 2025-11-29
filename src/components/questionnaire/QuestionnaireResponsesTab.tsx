import { Download, ExternalLink, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Questionnaire, QuestionnaireAnalytics } from "@/types";

interface QuestionnaireResponsesTabProps {
  questionnaire: Questionnaire;
  analytics: QuestionnaireAnalytics | null;
}

const formatDateTime = (isoDate: string) => {
  const date = new Date(isoDate);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

export function QuestionnaireResponsesTab({ questionnaire: q, analytics }: QuestionnaireResponsesTabProps) {
  const responses = q.completions.filter((c) => c.completedAt !== null);

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-[hsl(var(--dark-grey))]">{q.responseCount} responses total</h3>
          <div className="flex gap-3">
            <Select defaultValue="all">
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="complete">Complete</SelectItem>
                <SelectItem value="partial">Partial</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export to Excel
            </Button>
            <Button variant="outline" asChild>
              <a href={q.formUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                View in Forms
              </a>
            </Button>
          </div>
        </div>

        {analytics?.questionSummaries && analytics.questionSummaries.length > 0 ? (
          <div className="space-y-8">
            {analytics.questionSummaries.map((summary, idx) => (
              <div key={summary.questionId}>
                <h4 className="font-medium text-[hsl(var(--dark-grey))] mb-4">
                  Question {idx + 1}: {summary.questionText}
                </h4>
                {summary.responseDistribution && (
                  <div className="space-y-2">
                    {Object.entries(summary.responseDistribution).map(([label, count]) => {
                      const percentage = Math.round((count / q.responseCount) * 100);
                      return (
                        <div key={label} className="flex items-center gap-3">
                          <span className="text-sm text-[hsl(var(--medium-grey))] w-48 truncate">{label}</span>
                          <div className="flex-1 bg-muted rounded-full h-8 relative">
                            <div
                              className="bg-[hsl(var(--gradient-blue))] h-full rounded-full flex items-center justify-end px-3"
                              style={{ width: `${Math.max(percentage, 10)}%` }}
                            >
                              <span className="text-xs text-white font-medium">
                                {count} ({percentage}%)
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[hsl(var(--medium-grey))] text-center py-8">
            Response analytics are not available. View responses in Microsoft Forms.
          </p>
        )}
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold text-[hsl(var(--dark-grey))] mb-4">Individual Responses</h3>
        {responses.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-medium text-[hsl(var(--medium-grey))]">
                    Name/Email
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[hsl(var(--medium-grey))]">
                    Submitted
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[hsl(var(--medium-grey))]">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[hsl(var(--medium-grey))]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {responses.map((response) => (
                  <tr key={response.userId} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4 text-sm text-[hsl(var(--dark-grey))]">
                      {response.userName || response.userEmail}
                    </td>
                    <td className="py-3 px-4 text-sm text-[hsl(var(--medium-grey))]">
                      {response.completedAt ? formatDateTime(response.completedAt) : "N/A"}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="default">Complete</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-[hsl(var(--medium-grey))] text-center py-8">No responses yet</p>
        )}
      </Card>
    </div>
  );
}
