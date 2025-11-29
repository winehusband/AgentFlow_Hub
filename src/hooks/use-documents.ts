/**
 * Document hooks
 *
 * React Query hooks for document operations.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  Document,
  UpdateDocumentRequest,
  DocumentEngagement,
  PaginatedList,
  PaginationParams,
  DocumentFilterParams,
  DocumentCategory,
  DocumentVisibility,
  BulkDocumentActionRequest,
} from "@/types";
import {
  getDocuments,
  getDocument,
  uploadDocument,
  updateDocument,
  deleteDocument,
  getDocumentEngagement,
  bulkDocumentAction,
  getPortalDocuments,
} from "@/services";
import { serializeParams } from "@/lib/query-keys";

// Query keys - use serialized params for stable cache keys
export const documentKeys = {
  all: ["documents"] as const,
  lists: () => [...documentKeys.all, "list"] as const,
  list: (hubId: string, params?: PaginationParams & DocumentFilterParams) =>
    [...documentKeys.lists(), hubId, serializeParams(params)] as const,
  detail: (hubId: string, docId: string) => [...documentKeys.all, hubId, docId] as const,
  engagement: (hubId: string, docId: string) => [...documentKeys.detail(hubId, docId), "engagement"] as const,
  portal: (hubId: string, params?: PaginationParams) => [...documentKeys.all, "portal", hubId, serializeParams(params)] as const,
};

/**
 * Hook to get documents for a hub
 */
export function useDocuments(hubId: string, params?: PaginationParams & DocumentFilterParams) {
  return useQuery<PaginatedList<Document>>({
    queryKey: documentKeys.list(hubId, params),
    queryFn: () => getDocuments(hubId, params),
    enabled: !!hubId,
  });
}

/**
 * Hook to get single document
 */
export function useDocument(hubId: string, documentId: string) {
  return useQuery<Document>({
    queryKey: documentKeys.detail(hubId, documentId),
    queryFn: () => getDocument(hubId, documentId),
    enabled: !!hubId && !!documentId,
  });
}

/**
 * Hook to get document engagement
 */
export function useDocumentEngagement(hubId: string, documentId: string) {
  return useQuery<DocumentEngagement>({
    queryKey: documentKeys.engagement(hubId, documentId),
    queryFn: () => getDocumentEngagement(hubId, documentId),
    enabled: !!hubId && !!documentId,
  });
}

/**
 * Hook to get portal documents (client view)
 */
export function usePortalDocuments(hubId: string, params?: PaginationParams) {
  return useQuery<PaginatedList<Document>>({
    queryKey: documentKeys.portal(hubId, params),
    queryFn: () => getPortalDocuments(hubId, params),
    enabled: !!hubId,
  });
}

interface UploadDocumentParams {
  file: File;
  name: string;
  category: DocumentCategory;
  visibility: DocumentVisibility;
  description?: string;
}

/**
 * Hook to upload document
 */
export function useUploadDocument(hubId: string) {
  const queryClient = useQueryClient();

  return useMutation<Document, Error, UploadDocumentParams>({
    mutationFn: ({ file, name, category, visibility, description }) =>
      uploadDocument(hubId, file, name, category, visibility, description),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentKeys.lists() });
    },
  });
}

/**
 * Hook to update document
 */
export function useUpdateDocument(hubId: string, documentId: string) {
  const queryClient = useQueryClient();

  return useMutation<Document, Error, UpdateDocumentRequest>({
    mutationFn: (data) => updateDocument(hubId, documentId, data),
    onSuccess: (doc) => {
      queryClient.setQueryData(documentKeys.detail(hubId, documentId), doc);
      queryClient.invalidateQueries({ queryKey: documentKeys.lists() });
    },
  });
}

/**
 * Hook to delete document
 */
export function useDeleteDocument(hubId: string) {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (documentId) => deleteDocument(hubId, documentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentKeys.lists() });
    },
  });
}

/**
 * Hook for bulk document actions
 */
export function useBulkDocumentAction(hubId: string) {
  const queryClient = useQueryClient();

  return useMutation<void, Error, BulkDocumentActionRequest>({
    mutationFn: (data) => bulkDocumentAction(hubId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentKeys.lists() });
    },
  });
}
