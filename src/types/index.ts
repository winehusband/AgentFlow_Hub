/**
 * Type exports - barrel file for clean imports
 *
 * Usage: import { Hub, User, EventType } from "@/types";
 */

// Common types
export type {
  PaginationParams,
  PaginationMeta,
  PaginatedList,
  ApiError,
  ApiErrorCode,
  ISODateString,
  UploadStatus,
  EntityId,
  ResourceRef,
  ResourceType,
} from "./common";

// Authentication types
export type {
  UserRole,
  User,
  AuthState,
  TokenScopes,
  AuthMeResponse,
  HubAccessSummary,
  AccessLevel,
  HubAccessCheckResponse,
  HubPermissions,
} from "./auth";

// Hub types
export type {
  HubStatus,
  Hub,
  CreateHubRequest,
  UpdateHubRequest,
  HubOverview,
  HubAlert,
  AlertType,
  EngagementStats,
  PortalConfig,
  HeroContentType,
  PortalSectionConfig,
  UpdatePortalConfigRequest,
} from "./hub";

// Proposal types
export type {
  Proposal,
  ProposalSettings,
  ProposalVersion,
  UploadProposalRequest,
  UpdateProposalSettingsRequest,
  ProposalViewerInfo,
  ProposalEngagement,
  SlideViewEngagement,
  SlideEngagement,
  ProposalComment,
  CreateProposalCommentRequest,
} from "./proposal";

// Video types
export type {
  VideoSourceType,
  VideoVisibility,
  Video,
  UploadVideoRequest,
  AddVideoLinkRequest,
  UpdateVideoRequest,
  VideoEngagement,
  VideoView,
  BulkVideoActionRequest,
} from "./video";

// Document types
export type {
  DocumentVisibility,
  DocumentCategory,
  Document,
  DocumentVersion,
  UploadDocumentRequest,
  UpdateDocumentRequest,
  DocumentEngagement,
  DocumentView,
  BulkDocumentActionRequest,
  DocumentFilterParams,
} from "./document";

// Message types
export type {
  MessageThreadSummary,
  MessageThreadDetail,
  ThreadParticipant,
  Message,
  MessageSender,
  MessageRecipient,
  MessageAttachment,
  SendMessageRequest,
  UpdateTeamNotesRequest,
  ArchiveThreadRequest,
  MessageFilterParams,
} from "./message";

// Meeting types
export type {
  MeetingStatus,
  Meeting,
  MeetingParticipant,
  ResponseStatus,
  MeetingRecording,
  MeetingTranscript,
  TranscriptSegment,
  ScheduleMeetingRequest,
  UpdateMeetingRequest,
  UpdateMeetingNotesRequest,
  MeetingFilterParams,
} from "./meeting";

// Questionnaire types
export type {
  QuestionnaireStatus,
  Questionnaire,
  QuestionnaireCompletion,
  LinkQuestionnaireRequest,
  UpdateQuestionnaireRequest,
  QuestionnaireResponse,
  QuestionnaireAnswer,
  QuestionnaireAnalytics,
  QuestionSummary,
} from "./questionnaire";
export { isQuestionnaireCompleted } from "./questionnaire";

// Member and access types
export type {
  HubMember,
  MemberRole,
  HubInvite,
  InviteStatus,
  CreateInviteRequest,
  UpdateMemberAccessRequest,
  ShareLink,
  CreateShareLinkRequest,
  AcceptInviteRequest,
  AcceptInviteResponse,
  MemberActivity,
} from "./member";
export { MemberActivityAction } from "./member";

// Activity and engagement types
export { EventType } from "./activity";
export type {
  ActivityEvent,
  LogEventRequest,
  EventMetadata,
  HubViewedMetadata,
  ProposalViewedMetadata,
  ProposalSlideTimeMetadata,
  VideoWatchedMetadata,
  VideoCompletedMetadata,
  DocumentViewedMetadata,
  DocumentDownloadedMetadata,
  MeetingJoinedMetadata,
  MessageSentMetadata,
  MessageReadMetadata,
  QuestionnaireStartedMetadata,
  QuestionnaireCompletedMetadata,
  ShareSentMetadata,
  ShareAcceptedMetadata,
  ActivityFeedItem,
  ActivityType,
} from "./activity";
