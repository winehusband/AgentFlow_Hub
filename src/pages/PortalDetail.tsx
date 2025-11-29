import { Routes, Route, Navigate, useParams } from "react-router-dom";
import { Loader2, AlertCircle } from "lucide-react";
import { ClientHubLayout } from "@/components/ClientHubLayout";
import { ClientOverviewSection } from "@/components/ClientOverviewSection";
import { ClientProposalSection } from "@/components/ClientProposalSection";
import { ClientVideosSection } from "@/components/ClientVideosSection";
import { ClientDocumentsSection } from "@/components/ClientDocumentsSection";
import { ClientMessagesSection } from "@/components/ClientMessagesSection";
import { ClientMeetingsSection } from "@/components/ClientMeetingsSection";
import { ClientQuestionnaireSection } from "@/components/ClientQuestionnaireSection";
import { ClientPeopleSection } from "@/components/ClientPeopleSection";
import { HubProvider } from "@/contexts/hub-context";
import { useCurrentUser } from "@/hooks";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const PortalDetail = () => {
  const { hubId } = useParams<{ hubId: string }>();
  const { data: authData, isLoading, isFetching } = useCurrentUser();

  // Verify user has access to this hub
  const hubAccess = authData?.hubAccess?.find((h) => h.hubId === hubId);
  const hubName = hubAccess?.hubName || "Your AgentFlow Hub";

  // Show loading state while auth data is being fetched
  if (isLoading || (isFetching && !authData)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-[hsl(var(--gradient-blue))]" />
      </div>
    );
  }

  // Not authenticated - redirect to login (handled by RequireClient guard, but just in case)
  if (!authData) {
    return <Navigate to="/login" replace />;
  }

  // No hubId in URL
  if (!hubId) {
    return (
      <div className="flex items-center justify-center min-h-screen p-8">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center space-y-4">
            <AlertCircle className="h-12 w-12 mx-auto text-amber-500" />
            <h2 className="text-xl font-semibold text-[hsl(var(--dark-grey))]">Invalid Portal Link</h2>
            <p className="text-[hsl(var(--medium-grey))]">
              This link doesn't include a valid hub ID. Please use the link provided in your invitation email.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // User doesn't have access to this hub
  if (!hubAccess) {
    return (
      <div className="flex items-center justify-center min-h-screen p-8">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center space-y-4">
            <AlertCircle className="h-12 w-12 mx-auto text-destructive" />
            <h2 className="text-xl font-semibold text-[hsl(var(--dark-grey))]">Access Denied</h2>
            <p className="text-[hsl(var(--medium-grey))]">
              You don't have permission to view this hub. If you believe this is an error, please contact the person who
              shared this link with you.
            </p>
            <Button variant="outline" onClick={() => window.history.back()}>
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <HubProvider hubId={hubId}>
      <ClientHubLayout hubName={hubName} viewMode="client">
        <Routes>
          <Route path="overview" element={<ClientOverviewSection />} />
          <Route path="proposal" element={<ClientProposalSection />} />
          <Route path="videos" element={<ClientVideosSection />} />
          <Route path="documents" element={<ClientDocumentsSection />} />
          <Route path="messages" element={<ClientMessagesSection />} />
          <Route path="meetings" element={<ClientMeetingsSection />} />
          <Route path="questionnaire" element={<ClientQuestionnaireSection />} />
          <Route path="people" element={<ClientPeopleSection />} />
          <Route path="/" element={<Navigate to="overview" replace />} />
        </Routes>
      </ClientHubLayout>
    </HubProvider>
  );
};

export default PortalDetail;
