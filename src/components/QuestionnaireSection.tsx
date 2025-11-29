import { useState, useEffect } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHubId } from "@/contexts/hub-context";
import {
  useQuestionnaires,
  useQuestionnaire,
  useQuestionnaireAnalytics,
  useLinkQuestionnaire,
  useUpdateQuestionnaire,
  useUnlinkQuestionnaire,
  useTrackEngagement,
  useToast,
} from "@/hooks";
import {
  QuestionnaireCard,
  QuestionnaireEmptyState,
  QuestionnaireStats,
  AddQuestionnaireDialog,
  QuestionnaireDetail,
} from "./questionnaire";
import type { LinkQuestionnaireRequest, QuestionnaireStatus } from "@/types";

export function QuestionnaireSection() {
  const hubId = useHubId();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  // Data hooks
  const { data: questionnairesData, isLoading } = useQuestionnaires(hubId);
  const { data: selectedQuestionnaire } = useQuestionnaire(hubId, selectedId || "");
  const { data: analytics } = useQuestionnaireAnalytics(hubId, selectedId || "");

  // Mutation hooks
  const { mutate: linkQuestionnaire, isPending: isLinking } = useLinkQuestionnaire(hubId);
  const updateMutation = useUpdateQuestionnaire(hubId, selectedId || "");
  const { mutate: unlinkQuestionnaire } = useUnlinkQuestionnaire(hubId);

  // Engagement tracking
  const { trackHubViewed } = useTrackEngagement(hubId);
  const { toast } = useToast();

  useEffect(() => {
    trackHubViewed("questionnaire");
  }, [trackHubViewed]);

  const questionnaires = questionnairesData?.items || [];

  const handleAdd = (data: LinkQuestionnaireRequest & { status?: QuestionnaireStatus }) => {
    linkQuestionnaire(data, {
      onSuccess: () => setAddDialogOpen(false),
    });
  };

  const handleEdit = (id?: string) => {
    if (id) {
      setSelectedId(id);
    } else {
      toast({
        title: "Edit Questionnaire",
        description: "Opening questionnaire editor...",
      });
    }
  };

  const handleToggleStatus = (id: string) => {
    const q = questionnaires.find((q) => q.id === id);
    if (!q) return;
    const newStatus: QuestionnaireStatus = q.status === "closed" ? "active" : "closed";
    updateMutation.mutate({ status: newStatus });
  };

  const handleDuplicate = (id: string) => {
    const q = questionnaires.find((q) => q.id === id);
    if (!q) return;
    linkQuestionnaire({
      formUrl: q.formUrl,
      title: `${q.title} (Copy)`,
      description: q.description || undefined,
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this questionnaire?")) {
      unlinkQuestionnaire(id);
      if (selectedId === id) setSelectedId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-[hsl(var(--gradient-blue))]" />
      </div>
    );
  }

  // Show detail view if a questionnaire is selected
  if (selectedId && selectedQuestionnaire) {
    return (
      <QuestionnaireDetail
        questionnaire={selectedQuestionnaire}
        analytics={analytics || null}
        onBack={() => setSelectedId(null)}
        onEdit={handleEdit}
        onToggleStatus={() => handleToggleStatus(selectedId)}
        onDuplicate={() => handleDuplicate(selectedId)}
        onDelete={() => handleDelete(selectedId)}
      />
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-[hsl(var(--bold-royal-blue))]">Questionnaires</h1>
          <Button
            className="bg-[hsl(var(--soft-coral))] hover:bg-[hsl(var(--soft-coral))]/90 text-white"
            onClick={() => setAddDialogOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Questionnaire
          </Button>
        </div>
        <p className="text-[hsl(var(--medium-grey))] text-sm">
          Create forms in Microsoft Forms, then add them here to track and share
        </p>
      </div>

      {/* Questionnaire Cards */}
      {questionnaires.length === 0 ? (
        <QuestionnaireEmptyState onAdd={() => setAddDialogOpen(true)} />
      ) : (
        <div className="space-y-4 mb-8">
          {questionnaires.map((q) => (
            <QuestionnaireCard
              key={q.id}
              questionnaire={q}
              onClick={setSelectedId}
              onEdit={handleEdit}
              onToggleStatus={handleToggleStatus}
              onDuplicate={handleDuplicate}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Stats Sidebar */}
      {questionnaires.length > 0 && <QuestionnaireStats questionnaires={questionnaires} />}

      <AddQuestionnaireDialog
        isOpen={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onAdd={handleAdd}
        isAdding={isLinking}
      />
    </div>
  );
}
