/**
 * Document types - file management and engagement tracking
 *
 * URL naming:
 * - embedUrl: Office Online web view (for inline viewing, if supported)
 * - downloadUrl: Direct file download
 */

import type { EntityId, ISODateString } from "./common";

// Document visibility (lowercase for consistency)
export type DocumentVisibility = "client" | "internal";

// Document category (lowercase for consistency)
export type DocumentCategory =
  | "proposal"
  | "contract"
  | "reference"
  | "brief"
  | "deliverable"
  | "other";

// Document entity
export interface Document {
  id: EntityId;
  hubId: EntityId;
  name: string;
  description: string | null;
  fileName: string;
  fileSize: number;
  mimeType: string;
  category: DocumentCategory;
  visibility: DocumentVisibility;
  uploadedAt: ISODateString;
  uploadedBy: EntityId;
  uploadedByName: string;
  downloadUrl: string; // Presigned URL for download
  embedUrl: string | null; // Office Online web view (null if not supported for this type)
  views: number;
  downloads: number;
  versions: DocumentVersion[];
}

// Document version history
export interface DocumentVersion {
  version: number;
  uploadedAt: ISODateString;
  uploadedBy: EntityId;
  uploadedByName: string;
  fileName: string;
  fileSize: number;
  downloadUrl: string;
}

// Upload document request
export interface UploadDocumentRequest {
  file: File;
  name: string;
  description?: string;
  category: DocumentCategory;
  visibility: DocumentVisibility;
}

// Update document metadata
export interface UpdateDocumentRequest {
  name?: string;
  description?: string;
  category?: DocumentCategory;
  visibility?: DocumentVisibility;
}

// Document engagement analytics
export interface DocumentEngagement {
  documentId: EntityId;
  totalViews: number;
  totalDownloads: number;
  uniqueViewers: number;
  viewHistory: DocumentView[];
}

// Individual document view/download record
export interface DocumentView {
  viewerId: EntityId;
  viewerName: string;
  viewerEmail: string;
  action: "view" | "download";
  timestamp: ISODateString;
}

// Bulk action request
export interface BulkDocumentActionRequest {
  documentIds: EntityId[];
  action: "delete" | "set_visibility" | "set_category";
  visibility?: DocumentVisibility;
  category?: DocumentCategory;
}

// Document filter params (extends pagination)
export interface DocumentFilterParams {
  visibility?: DocumentVisibility;
  category?: DocumentCategory;
}
