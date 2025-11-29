import { AlertCircle, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { HubAlert } from "@/types";

interface AlertsListProps {
  alerts: HubAlert[];
}

export function AlertsList({ alerts }: AlertsListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[hsl(var(--dark-grey))]">
          Needs Attention
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alerts.length === 0 ? (
            <p className="text-sm text-[hsl(var(--medium-grey))]">No pending items</p>
          ) : (
            alerts.map((alert) => (
              <div
                key={alert.id}
                className={`flex items-start gap-3 ${
                  alert.isRead ? "opacity-50" : ""
                }`}
              >
                {alert.isRead ? (
                  <CheckCircle className="w-5 h-5 text-[hsl(var(--sage-green))] mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-[hsl(var(--soft-coral))] mt-0.5" />
                )}
                <div className="flex-1">
                  <p
                    className={`text-sm ${
                      alert.isRead
                        ? "text-[hsl(var(--medium-grey))] line-through"
                        : "text-[hsl(var(--dark-grey))]"
                    }`}
                  >
                    {alert.title}
                  </p>
                  {alert.description && (
                    <p className="text-xs text-[hsl(var(--medium-grey))] mt-0.5">
                      {alert.description}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
