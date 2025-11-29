/**
 * Message hooks
 *
 * React Query hooks for email thread operations.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  MessageThreadSummary,
  MessageThreadDetail,
  Message,
  SendMessageRequest,
  PaginatedList,
  PaginationParams,
  MessageFilterParams,
} from "@/types";
import {
  getMessageThreads,
  getMessageThread,
  sendMessage,
  updateTeamNotes,
  archiveThread,
  getPortalMessages,
  sendPortalMessage,
} from "@/services";
import { serializeParams } from "@/lib/query-keys";

// Query keys - use serialized params for stable cache keys
export const messageKeys = {
  all: ["messages"] as const,
  lists: () => [...messageKeys.all, "list"] as const,
  list: (hubId: string, params?: PaginationParams & MessageFilterParams) =>
    [...messageKeys.lists(), hubId, serializeParams(params)] as const,
  detail: (hubId: string, threadId: string) => [...messageKeys.all, hubId, threadId] as const,
  portal: (hubId: string, params?: PaginationParams) => [...messageKeys.all, "portal", hubId, serializeParams(params)] as const,
};

/**
 * Hook to get message threads for a hub
 */
export function useMessageThreads(hubId: string, params?: PaginationParams & MessageFilterParams) {
  return useQuery<PaginatedList<MessageThreadSummary>>({
    queryKey: messageKeys.list(hubId, params),
    queryFn: () => getMessageThreads(hubId, params),
    enabled: !!hubId,
  });
}

/**
 * Hook to get thread detail with messages
 */
export function useMessageThread(hubId: string, threadId: string) {
  return useQuery<MessageThreadDetail>({
    queryKey: messageKeys.detail(hubId, threadId),
    queryFn: () => getMessageThread(hubId, threadId),
    enabled: !!hubId && !!threadId,
  });
}

/**
 * Hook to get portal messages (client view)
 */
export function usePortalMessages(hubId: string, params?: PaginationParams) {
  return useQuery<PaginatedList<MessageThreadSummary>>({
    queryKey: messageKeys.portal(hubId, params),
    queryFn: () => getPortalMessages(hubId, params),
    enabled: !!hubId,
  });
}

/**
 * Hook to send a message
 */
export function useSendMessage(hubId: string) {
  const queryClient = useQueryClient();

  return useMutation<Message, Error, SendMessageRequest>({
    mutationFn: (data) => sendMessage(hubId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: messageKeys.lists() });
    },
  });
}

/**
 * Hook to send portal message (client action)
 */
export function useSendPortalMessage(hubId: string) {
  const queryClient = useQueryClient();

  return useMutation<Message, Error, SendMessageRequest>({
    mutationFn: (data) => sendPortalMessage(hubId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: messageKeys.portal(hubId) });
    },
  });
}

/**
 * Hook to update team notes on a thread
 */
export function useUpdateTeamNotes(hubId: string, threadId: string) {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (notes) => updateTeamNotes(hubId, threadId, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: messageKeys.detail(hubId, threadId) });
    },
  });
}

/**
 * Hook to archive/unarchive thread
 */
export function useArchiveThread(hubId: string) {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { threadId: string; archive: boolean }>({
    mutationFn: ({ threadId, archive }) => archiveThread(hubId, threadId, archive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: messageKeys.lists() });
    },
  });
}
