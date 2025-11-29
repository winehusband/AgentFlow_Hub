import { Card } from "@/components/ui/card";
import type { Questionnaire } from "@/types";

interface QuestionnaireStatsProps {
  questionnaires: Questionnaire[];
}

export function QuestionnaireStats({ questionnaires }: QuestionnaireStatsProps) {
  const activeCount = questionnaires.filter((q) => q.status === "active").length;
  const totalResponses = questionnaires.reduce((sum, q) => sum + q.responseCount, 0);
  const awaitingResponses = questionnaires.reduce((sum, q) => {
    const pending = q.completions.filter((c) => c.completedAt === null).length;
    return sum + pending;
  }, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="p-6">
        <h3 className="font-semibold text-[hsl(var(--dark-grey))] mb-4">Quick Stats</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-[hsl(var(--medium-grey))]">Total questionnaires:</span>
            <span className="font-semibold text-[hsl(var(--dark-grey))]">{questionnaires.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[hsl(var(--medium-grey))]">Active:</span>
            <span className="font-semibold text-[hsl(var(--dark-grey))]">{activeCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[hsl(var(--medium-grey))]">Total responses:</span>
            <span className="font-semibold text-[hsl(var(--dark-grey))]">{totalResponses}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[hsl(var(--medium-grey))]">Awaiting responses:</span>
            <span className="font-semibold text-[hsl(var(--dark-grey))]">{awaitingResponses}</span>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold text-[hsl(var(--dark-grey))] mb-4">Recent Activity</h3>
        <div className="space-y-3 text-sm">
          {questionnaires.slice(0, 3).map((q) => (
            <div key={q.id}>
              <p className="text-[hsl(var(--dark-grey))]">{q.title}</p>
              <p className="text-[hsl(var(--medium-grey))] text-xs">
                {q.responseCount} responses · Created {new Date(q.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
          {questionnaires.length === 0 && (
            <p className="text-[hsl(var(--medium-grey))]">No activity yet</p>
          )}
        </div>
      </Card>
    </div>
  );
}
