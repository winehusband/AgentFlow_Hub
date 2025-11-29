import { Eye } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import type { ProposalSettings } from "@/types";

interface ClientAccessPanelProps {
  settings: ProposalSettings;
  onVisibilityChange: (isVisible: boolean) => void;
  onDownloadChange: (isEnabled: boolean) => void;
}

export function ClientAccessPanel({
  settings,
  onVisibilityChange,
  onDownloadChange,
}: ClientAccessPanelProps) {
  return (
    <Card className="p-4 mt-6">
      <h3 className="font-semibold text-foreground mb-4">Client Access</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">Visible to client</span>
          </div>
          <Switch
            checked={settings.isClientVisible}
            onCheckedChange={onVisibilityChange}
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Checkbox
              id="download-enabled"
              checked={settings.isDownloadEnabled}
              onCheckedChange={(checked) => onDownloadChange(checked === true)}
            />
            <label
              htmlFor="download-enabled"
              className="text-sm cursor-pointer"
            >
              Download enabled for client
            </label>
          </div>
        </div>
        <Button variant="outline" size="sm" className="w-full">
          Copy Share Link
        </Button>
      </div>
    </Card>
  );
}
