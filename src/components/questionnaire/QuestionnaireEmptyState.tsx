import { ClipboardList, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuestionnaireEmptyStateProps {
  onAdd: () => void;
}

export function QuestionnaireEmptyState({ onAdd }: QuestionnaireEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <ClipboardList className="w-16 h-16 text-[hsl(var(--medium-grey))] mb-4" />
      <h3 className="text-xl font-semibold text-[hsl(var(--dark-grey))] mb-2">No questionnaires yet</h3>
      <p className="text-[hsl(var(--medium-grey))] mb-6">Add a questionnaire to gather insights from your client</p>
      <Button className="bg-[hsl(var(--soft-coral))] hover:bg-[hsl(var(--soft-coral))]/90 text-white" onClick={onAdd}>
        <Plus className="w-4 h-4 mr-2" />
        Add Questionnaire
      </Button>
    </div>
  );
}
