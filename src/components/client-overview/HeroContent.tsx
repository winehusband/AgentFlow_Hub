import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useHubId } from "@/contexts/hub-context";
import type { HeroContentType } from "@/types";

interface HeroContentProps {
  heroType: HeroContentType;
  hasProposal: boolean;
  hasWelcomeVideo: boolean;
  proposalTitle?: string;
  welcomeVideoUrl?: string;
}

export function HeroContent({
  heroType,
  hasProposal,
  hasWelcomeVideo,
  proposalTitle,
  welcomeVideoUrl,
}: HeroContentProps) {
  const navigate = useNavigate();
  const hubId = useHubId();

  if (heroType === "video" && hasWelcomeVideo) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="aspect-video bg-muted flex items-center justify-center">
            {welcomeVideoUrl ? (
              <iframe
                src={welcomeVideoUrl}
                className="w-full h-full"
                allowFullScreen
              />
            ) : (
              <div className="text-center">
                <Play className="h-20 w-20 mx-auto mb-3 text-[hsl(var(--medium-grey))]" />
                <p className="text-[hsl(var(--medium-grey))]">Video player placeholder</p>
              </div>
            )}
          </div>
          <div className="p-6">
            <h3 className="text-xl font-semibold text-[hsl(var(--dark-grey))]">
              Introduction from the Team
            </h3>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (heroType === "proposal" && hasProposal) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-6 flex flex-col md:flex-row gap-6 items-center">
          <div className="w-full md:w-48 aspect-[3/4] bg-muted rounded-lg flex items-center justify-center">
            <FileText className="h-16 w-16 text-[hsl(var(--medium-grey))]" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-2xl font-semibold text-[hsl(var(--dark-grey))] mb-4">
              {proposalTitle || "Our Proposal"}
            </h3>
            <Button
              onClick={() => navigate(`/portal/${hubId}/proposal`)}
              className="bg-[hsl(var(--gradient-blue))] hover:bg-[hsl(var(--gradient-blue))]/90 text-white"
            >
              View Proposal
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (heroType === "both" && hasProposal && hasWelcomeVideo) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="aspect-video bg-muted flex items-center justify-center">
              <Play className="h-16 w-16 text-[hsl(var(--medium-grey))]" />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-[hsl(var(--dark-grey))]">
                Introduction from the Team
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
            <div className="w-32 h-40 bg-muted rounded-lg flex items-center justify-center mb-4">
              <FileText className="h-12 w-12 text-[hsl(var(--medium-grey))]" />
            </div>
            <h3 className="font-semibold text-[hsl(var(--dark-grey))] mb-4">
              Our Proposal
            </h3>
            <Button
              onClick={() => navigate(`/portal/${hubId}/proposal`)}
              className="bg-[hsl(var(--gradient-blue))] hover:bg-[hsl(var(--gradient-blue))]/90 text-white"
            >
              View Proposal
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}
