/**
 * Meeting hooks
 *
 * React Query hooks for meeting operations.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  Meeting,
  ScheduleMeetingRequest,
  UpdateMeetingRequest,
  PaginatedList,
  PaginationParams,
  MeetingFilterParams,
} from "@/types";
import {
  getMeetings,
  getMeeting,
  scheduleMeeting,
  updateMeeting,
  updateMeetingAgenda,
  updateMeetingNotes,
  cancelMeeting,
  getMeetingRecording,
  getMeetingTranscript,
  getPortalMeetings,
} from "@/services";
import { serializeParams } from "@/lib/query-keys";

// Query keys - use serialized params for stable cache keys
export const meetingKeys = {
  all: ["meetings"] as const,
  lists: () => [...meetingKeys.all, "list"] as const,
  list: (hubId: string, params?: PaginationParams & MeetingFilterParams) =>
    [...meetingKeys.lists(), hubId, serializeParams(params)] as const,
  detail: (hubId: string, meetingId: string) => [...meetingKeys.all, hubId, meetingId] as const,
  recording: (hubId: string, meetingId: string) => [...meetingKeys.detail(hubId, meetingId), "recording"] as const,
  transcript: (hubId: string, meetingId: string) => [...meetingKeys.detail(hubId, meetingId), "transcript"] as const,
  portal: (hubId: string, params?: PaginationParams) => [...meetingKeys.all, "portal", hubId, serializeParams(params)] as const,
};

/**
 * Hook to get meetings for a hub
 */
export function useMeetings(hubId: string, params?: PaginationParams & MeetingFilterParams) {
  return useQuery<PaginatedList<Meeting>>({
    queryKey: meetingKeys.list(hubId, params),
    queryFn: () => getMeetings(hubId, params),
    enabled: !!hubId,
  });
}

/**
 * Hook to get single meeting
 */
export function useMeeting(hubId: string, meetingId: string) {
  return useQuery<Meeting>({
    queryKey: meetingKeys.detail(hubId, meetingId),
    queryFn: () => getMeeting(hubId, meetingId),
    enabled: !!hubId && !!meetingId,
  });
}

/**
 * Hook to get meeting recording URL
 */
export function useMeetingRecording(hubId: string, meetingId: string) {
  return useQuery<string | null>({
    queryKey: meetingKeys.recording(hubId, meetingId),
    queryFn: () => getMeetingRecording(hubId, meetingId),
    enabled: !!hubId && !!meetingId,
  });
}

/**
 * Hook to get meeting transcript
 */
export function useMeetingTranscript(hubId: string, meetingId: string) {
  return useQuery<string | null>({
    queryKey: meetingKeys.transcript(hubId, meetingId),
    queryFn: () => getMeetingTranscript(hubId, meetingId),
    enabled: !!hubId && !!meetingId,
  });
}

/**
 * Hook to get portal meetings (client view)
 */
export function usePortalMeetings(hubId: string, params?: PaginationParams) {
  return useQuery<PaginatedList<Meeting>>({
    queryKey: meetingKeys.portal(hubId, params),
    queryFn: () => getPortalMeetings(hubId, params),
    enabled: !!hubId,
  });
}

/**
 * Hook to schedule a meeting
 */
export function useScheduleMeeting(hubId: string) {
  const queryClient = useQueryClient();

  return useMutation<Meeting, Error, ScheduleMeetingRequest>({
    mutationFn: (data) => scheduleMeeting(hubId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: meetingKeys.lists() });
    },
  });
}

/**
 * Hook to update meeting
 */
export function useUpdateMeeting(hubId: string, meetingId: string) {
  const queryClient = useQueryClient();

  return useMutation<Meeting, Error, UpdateMeetingRequest>({
    mutationFn: (data) => updateMeeting(hubId, meetingId, data),
    onSuccess: (meeting) => {
      queryClient.setQueryData(meetingKeys.detail(hubId, meetingId), meeting);
      queryClient.invalidateQueries({ queryKey: meetingKeys.lists() });
    },
  });
}

/**
 * Hook to update meeting agenda
 */
export function useUpdateMeetingAgenda(hubId: string, meetingId: string) {
  const queryClient = useQueryClient();

  return useMutation<Meeting, Error, string>({
    mutationFn: (agenda) => updateMeetingAgenda(hubId, meetingId, agenda),
    onSuccess: (meeting) => {
      queryClient.setQueryData(meetingKeys.detail(hubId, meetingId), meeting);
    },
  });
}

/**
 * Hook to update meeting notes
 */
export function useUpdateMeetingNotes(hubId: string, meetingId: string) {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (notes) => updateMeetingNotes(hubId, meetingId, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: meetingKeys.detail(hubId, meetingId) });
    },
  });
}

/**
 * Hook to cancel meeting
 */
export function useCancelMeeting(hubId: string) {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (meetingId) => cancelMeeting(hubId, meetingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: meetingKeys.lists() });
    },
  });
}
