import { Routes, Route, Navigate } from "react-router-dom";
import { ClientHubLayout } from "@/components/ClientHubLayout";
import { ClientOverviewSection } from "@/components/ClientOverviewSection";

const PortalDetail = () => {
  return (
    <ClientHubLayout hubName="Your AgentFlow Hub" viewMode="client">
      <Routes>
        <Route path="overview" element={<ClientOverviewSection />} />
        <Route path="proposal" element={<div className="text-[hsl(var(--dark-grey))]">Proposal Section (Coming Soon)</div>} />
        <Route path="videos" element={<div className="text-[hsl(var(--dark-grey))]">Videos Section (Coming Soon)</div>} />
        <Route path="documents" element={<div className="text-[hsl(var(--dark-grey))]">Documents Section (Coming Soon)</div>} />
        <Route path="messages" element={<div className="text-[hsl(var(--dark-grey))]">Messages Section (Coming Soon)</div>} />
        <Route path="meetings" element={<div className="text-[hsl(var(--dark-grey))]">Meetings Section (Coming Soon)</div>} />
        <Route path="/" element={<Navigate to="overview" replace />} />
      </Routes>
    </ClientHubLayout>
  );
};

export default PortalDetail;
