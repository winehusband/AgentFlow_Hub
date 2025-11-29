import { MoreVertical, BarChart3, Copy, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Questionnaire } from "@/types";

interface QuestionnaireCardProps {
  questionnaire: Questionnaire;
  onClick: (id: string) => void;
  onEdit: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
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

export function QuestionnaireCard({
  questionnaire: q,
  onClick,
  onEdit,
  onToggleStatus,
  onDuplicate,
  onDelete,
}: QuestionnaireCardProps) {
  const completedCount = q.completions.filter((c) => c.completedAt !== null).length;
  const sentCount = q.completions.length;
  const completionRate = sentCount > 0 ? Math.round((completedCount / sentCount) * 100) : 0;

  return (
    <Card
      className={`p-6 border-l-4 hover:shadow-md transition-shadow cursor-pointer ${
        q.status === "active"
          ? "border-l-[hsl(var(--sage-green))]"
          : q.status === "draft"
          ? "border-l-amber-500"
          : "border-l-[hsl(var(--medium-grey))]"
      } ${q.status === "closed" ? "opacity-70" : ""}`}
      onClick={() => onClick(q.id)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            {getStatusBadge(q.status)}
            <h3 className="text-xl font-bold text-[hsl(var(--dark-grey))]">{q.title}</h3>
          </div>
          <p className="text-[hsl(var(--medium-grey))]">{q.description}</p>
          <p className="text-sm text-[hsl(var(--medium-grey))] mt-2">Created: {formatDate(q.createdAt)}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(q.id)}>Edit Details</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onToggleStatus(q.id)}>
              {q.status === "closed" ? "Reopen" : "Close Questionnaire"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDuplicate(q.id)}>Duplicate</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive" onClick={() => onDelete(q.id)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {q.status !== "draft" && q.responseCount > 0 ? (
        <>
          <div className="flex items-center gap-6 text-sm mb-3">
            <span className="text-[hsl(var(--medium-grey))]">
              <strong className="text-[hsl(var(--dark-grey))]">{q.responseCount} responses</strong>
            </span>
            <span className="text-[hsl(var(--medium-grey))]">Sent to: {sentCount} people</span>
            <span className="text-[hsl(var(--medium-grey))]">
              Completed: {completedCount} ({completionRate}%)
            </span>
          </div>
          <Progress value={completionRate} className="h-2 mb-4" />
        </>
      ) : q.status === "draft" ? (
        <p className="text-[hsl(var(--medium-grey))] text-sm mb-4">Not yet shared</p>
      ) : null}

      <div className="flex gap-3" onClick={(e) => e.stopPropagation()}>
        <Button className="bg-[hsl(var(--gradient-blue))] hover:bg-[hsl(var(--gradient-blue))]/90 text-white">
          <BarChart3 className="w-4 h-4 mr-2" />
          View Responses
        </Button>
        <Button variant="outline">
          <Copy className="w-4 h-4 mr-2" />
          Copy Link
        </Button>
        <Button variant="outline">
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
      </div>
    </Card>
  );
}
