/**
 * Proposal types - document viewer and engagement tracking
 *
 * URL naming:
 * - embedUrl: Office Online web view (for inline viewing)
 * - downloadUrl: Direct file download
 * - thumbnailUrl: Preview image
 */

import type { EntityId, ISODateString } from "./common";

// Proposal entity
export interface Proposal {
  id: EntityId;
  hubId: EntityId;
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: ISODateString;
  uploadedBy: EntityId;
  totalSlides: number;
  embedUrl: string; // Office Online web view for inline viewing
  downloadUrl: string | null; // Presigned URL for download (null if disabled)
  thumbnailUrl: string | null;
  settings: ProposalSettings;
  versions: ProposalVersion[];
}

// Proposal visibility/download settings
export interface ProposalSettings {
  isClientVisible: boolean;
  isDownloadEnabled: boolean;
}

// Version history entry
export interface ProposalVersion {
  id: EntityId;
  versionNumber: number;
  uploadedAt: ISODateString;
  uploadedBy: EntityId;
  uploadedByName: string;
  fileName: string;
}

// Proposal upload request
export interface UploadProposalRequest {
  file: File;
  replaceExisting?: boolean;
}

// Update proposal settings
export interface UpdateProposalSettingsRequest {
  isClientVisible?: boolean;
  isDownloadEnabled?: boolean;
}

// Viewer info for engagement display
// Named ProposalViewerInfo to avoid collision with ProposalViewer component
export interface ProposalViewerInfo {
  id: EntityId;
  name: string;
  email: string;
}

// Proposal engagement analytics
export interface ProposalEngagement {
  totalViews: number;
  uniqueViewers: number;
  avgTimeSpent: number; // seconds
  totalTimeSpent: number; // seconds - total across all sessions
  lastViewedAt: ISODateString | null;
  viewers: ProposalViewerInfo[];
  mostViewedSlide: number | null;
  slideViews: SlideViewEngagement[];
  slideEngagement: SlideEngagement[]; // detailed analytics
}

// Simplified slide view data for UI display
export interface SlideViewEngagement {
  slideNumber: number;
  title: string | null;
  timeSpent: number; // seconds
}

// Per-slide engagement data (detailed analytics)
export interface SlideEngagement {
  slideNumber: number;
  views: number;
  avgTimeSpent: number; // seconds
  dropOffRate: number; // percentage
}

// Comment on proposal slide
export interface ProposalComment {
  id: EntityId;
  proposalId: EntityId;
  slideNumber: number;
  authorId: EntityId;
  authorName: string;
  authorEmail: string;
  content: string;
  createdAt: ISODateString;
  threadId: EntityId | null; // Links to message thread if created
}

// Create comment request (from client portal)
export interface CreateProposalCommentRequest {
  slideNumber: number;
  content: string;
}
