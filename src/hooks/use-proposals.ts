/**
 * Proposal hooks
 *
 * React Query hooks for proposal operations.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  Proposal,
  UpdateProposalSettingsRequest,
  ProposalEngagement,
  ProposalComment,
  CreateProposalCommentRequest,
} from "@/types";
import {
  getProposal,
  uploadProposal,
  deleteProposal,
  updateProposalSettings,
  getProposalEngagement,
  getPortalProposal,
  submitProposalComment,
} from "@/services";

// Query keys
export const proposalKeys = {
  all: ["proposals"] as const,
  detail: (hubId: string) => [...proposalKeys.all, hubId] as const,
  engagement: (hubId: string) => [...proposalKeys.detail(hubId), "engagement"] as const,
  portal: (hubId: string) => [...proposalKeys.all, "portal", hubId] as const,
};

/**
 * Hook to get proposal for a hub
 */
export function useProposal(hubId: string) {
  return useQuery<Proposal | null>({
    queryKey: proposalKeys.detail(hubId),
    queryFn: () => getProposal(hubId),
    enabled: !!hubId,
  });
}

/**
 * Hook to get proposal engagement analytics
 */
export function useProposalEngagement(hubId: string) {
  return useQuery<ProposalEngagement>({
    queryKey: proposalKeys.engagement(hubId),
    queryFn: () => getProposalEngagement(hubId),
    enabled: !!hubId,
  });
}

/**
 * Hook to get portal proposal (client view)
 */
export function usePortalProposal(hubId: string) {
  return useQuery<Proposal | null>({
    queryKey: proposalKeys.portal(hubId),
    queryFn: () => getPortalProposal(hubId),
    enabled: !!hubId,
  });
}

/**
 * Hook to upload proposal
 */
export function useUploadProposal(hubId: string) {
  const queryClient = useQueryClient();

  return useMutation<Proposal, Error, { file: File; replaceExisting?: boolean }>({
    mutationFn: ({ file, replaceExisting }) => uploadProposal(hubId, file, replaceExisting),
    onSuccess: (proposal) => {
      queryClient.setQueryData(proposalKeys.detail(hubId), proposal);
    },
  });
}

/**
 * Hook to delete proposal
 */
export function useDeleteProposal(hubId: string) {
  const queryClient = useQueryClient();

  return useMutation<void, Error>({
    mutationFn: () => deleteProposal(hubId),
    onSuccess: () => {
      queryClient.setQueryData(proposalKeys.detail(hubId), null);
    },
  });
}

/**
 * Hook to update proposal settings
 */
export function useUpdateProposalSettings(hubId: string) {
  const queryClient = useQueryClient();

  return useMutation<Proposal, Error, UpdateProposalSettingsRequest>({
    mutationFn: (settings) => updateProposalSettings(hubId, settings),
    onSuccess: (proposal) => {
      queryClient.setQueryData(proposalKeys.detail(hubId), proposal);
    },
  });
}

/**
 * Hook to submit proposal comment (client portal)
 */
export function useSubmitProposalComment(hubId: string) {
  return useMutation<ProposalComment, Error, CreateProposalCommentRequest>({
    mutationFn: (data) => submitProposalComment(hubId, data),
  });
}
