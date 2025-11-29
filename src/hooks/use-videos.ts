/**
 * Video hooks
 *
 * React Query hooks for video operations.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  Video,
  AddVideoLinkRequest,
  UpdateVideoRequest,
  VideoEngagement,
  PaginatedList,
  PaginationParams,
  BulkVideoActionRequest,
} from "@/types";
import {
  getVideos,
  getVideo,
  uploadVideo,
  addVideoLink,
  updateVideo,
  deleteVideo,
  getVideoEngagement,
  bulkVideoAction,
  getPortalVideos,
} from "@/services";
import { serializeParams } from "@/lib/query-keys";

// Query keys - use serialized params for stable cache keys
export const videoKeys = {
  all: ["videos"] as const,
  lists: () => [...videoKeys.all, "list"] as const,
  list: (hubId: string, params?: PaginationParams) => [...videoKeys.lists(), hubId, serializeParams(params)] as const,
  detail: (hubId: string, videoId: string) => [...videoKeys.all, hubId, videoId] as const,
  engagement: (hubId: string, videoId: string) => [...videoKeys.detail(hubId, videoId), "engagement"] as const,
  portal: (hubId: string, params?: PaginationParams) => [...videoKeys.all, "portal", hubId, serializeParams(params)] as const,
};

/**
 * Hook to get videos for a hub
 */
export function useVideos(hubId: string, params?: PaginationParams) {
  return useQuery<PaginatedList<Video>>({
    queryKey: videoKeys.list(hubId, params),
    queryFn: () => getVideos(hubId, params),
    enabled: !!hubId,
  });
}

/**
 * Hook to get single video
 */
export function useVideo(hubId: string, videoId: string) {
  return useQuery<Video>({
    queryKey: videoKeys.detail(hubId, videoId),
    queryFn: () => getVideo(hubId, videoId),
    enabled: !!hubId && !!videoId,
  });
}

/**
 * Hook to get video engagement
 */
export function useVideoEngagement(hubId: string, videoId: string) {
  return useQuery<VideoEngagement>({
    queryKey: videoKeys.engagement(hubId, videoId),
    queryFn: () => getVideoEngagement(hubId, videoId),
    enabled: !!hubId && !!videoId,
  });
}

/**
 * Hook to get portal videos (client view)
 */
export function usePortalVideos(hubId: string, params?: PaginationParams) {
  return useQuery<PaginatedList<Video>>({
    queryKey: videoKeys.portal(hubId, params),
    queryFn: () => getPortalVideos(hubId, params),
    enabled: !!hubId,
  });
}

/**
 * Hook to upload video
 */
export function useUploadVideo(hubId: string) {
  const queryClient = useQueryClient();

  return useMutation<Video, Error, { file: File; title: string; description?: string; visibility?: "client" | "internal" }>({
    mutationFn: ({ file, title, description, visibility }) =>
      uploadVideo(hubId, file, title, description, visibility),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: videoKeys.lists() });
    },
  });
}

/**
 * Hook to add video link
 */
export function useAddVideoLink(hubId: string) {
  const queryClient = useQueryClient();

  return useMutation<Video, Error, AddVideoLinkRequest>({
    mutationFn: (data) => addVideoLink(hubId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: videoKeys.lists() });
    },
  });
}

/**
 * Hook to update video
 */
export function useUpdateVideo(hubId: string, videoId: string) {
  const queryClient = useQueryClient();

  return useMutation<Video, Error, UpdateVideoRequest>({
    mutationFn: (data) => updateVideo(hubId, videoId, data),
    onSuccess: (video) => {
      queryClient.setQueryData(videoKeys.detail(hubId, videoId), video);
      queryClient.invalidateQueries({ queryKey: videoKeys.lists() });
    },
  });
}

/**
 * Hook to delete video
 */
export function useDeleteVideo(hubId: string) {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (videoId) => deleteVideo(hubId, videoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: videoKeys.lists() });
    },
  });
}

/**
 * Hook for bulk video actions
 */
export function useBulkVideoAction(hubId: string) {
  const queryClient = useQueryClient();

  return useMutation<void, Error, BulkVideoActionRequest>({
    mutationFn: (data) => bulkVideoAction(hubId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: videoKeys.lists() });
    },
  });
}
