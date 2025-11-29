import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ClipboardList, CheckCircle2, ExternalLink, Loader2 } from "lucide-react";
import { useHubId } from "@/contexts/hub-context";
import { usePortalQuestionnaires, useTrackEngagement } from "@/hooks";
import type { Questionnaire, QuestionnaireStatus } from "@/types";

export function ClientQuestionnaireSection() {
  const hubId = useHubId();

  // Data hooks
  const { data: questionnairesData, isLoading } = usePortalQuestionnaires(hubId);

  // Engagement tracking
  const { trackHubViewed } = useTrackEngagement(hubId);

  useEffect(() => {
    trackHubViewed("portal-questionnaire");
  }, [trackHubViewed]);

  const questionnaires = questionnairesData?.items || [];

  const getStatusBadge = (status: QuestionnaireStatus) => {
    switch (status) {
      case "draft":
        return <Badge className="bg-amber-500 text-white">Not Started</Badge>;
      case "active":
        return <Badge className="bg-[hsl(var(--gradient-blue))] text-white">In Progress</Badge>;
      case "closed":
        return <Badge className="bg-[hsl(var(--sage-green))] text-white">Completed</Badge>;
      default:
        return null;
    }
  };

  const handleStartQuestionnaire = (questionnaire: Questionnaire) => {
    // In production, this would open the MS Forms URL
    if (questionnaire.formUrl) {
      window.open(questionnaire.formUrl, "_blank");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-[hsl(var(--gradient-blue))]" />
      </div>
    );
  }

  if (questionnaires.length === 0) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-[hsl(var(--bold-royal-blue))] mb-6">Questionnaires</h1>
        <Card>
          <CardContent className="py-16 text-center">
            <ClipboardList className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold text-[hsl(var(--dark-grey))] mb-2">No Questionnaires</h2>
            <p className="text-[hsl(var(--medium-grey))]">Questionnaires will appear here when assigned to you.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[hsl(var(--bold-royal-blue))] mb-2">Questionnaires</h1>
        <p className="text-[hsl(var(--medium-grey))]">Help us understand your needs</p>
      </div>

      {/* Questionnaire List */}
      <div className="space-y-4">
        {questionnaires.map((questionnaire) => (
          <Card key={questionnaire.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-[hsl(var(--dark-grey))] mb-2">{questionnaire.title}</h3>
                  {questionnaire.description && (
                    <p className="text-[hsl(var(--medium-grey))] mb-3">{questionnaire.description}</p>
                  )}
                  <div className="flex items-center gap-2 text-sm text-[hsl(var(--medium-grey))]">
                    <span>{questionnaire.totalQuestions || "?"} questions</span>
                    {questionnaire.estimatedMinutes && (
                      <>
                        <span>•</span>
                        <span>~{questionnaire.estimatedMinutes} minutes</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-start gap-2 ml-4">{getStatusBadge(questionnaire.status)}</div>
              </div>

              {/* Progress for in-progress questionnaires */}
              {questionnaire.status === "active" && questionnaire.completedQuestions !== undefined && (
                <div className="mb-4 space-y-2">
                  <div className="flex justify-between text-sm text-[hsl(var(--medium-grey))]">
                    <span>{questionnaire.completedQuestions} of {questionnaire.totalQuestions} completed</span>
                  </div>
                  <Progress
                    value={((questionnaire.completedQuestions || 0) / (questionnaire.totalQuestions || 1)) * 100}
                    className="h-2"
                  />
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                {questionnaire.status === "draft" && (
                  <Button
                    onClick={() => handleStartQuestionnaire(questionnaire)}
                    className="bg-[hsl(var(--soft-coral))] hover:bg-[hsl(var(--soft-coral))]/90"
                  >
                    Start
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                )}
                {questionnaire.status === "active" && (
                  <Button
                    onClick={() => handleStartQuestionnaire(questionnaire)}
                    className="bg-[hsl(var(--gradient-blue))] hover:bg-[hsl(var(--gradient-blue))]/90"
                  >
                    Continue
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                )}
                {questionnaire.status === "closed" && (
                  <div className="flex items-center gap-2 text-[hsl(var(--sage-green))]">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="text-sm font-medium">Completed</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
