# AgentFlow Pitch Hub - API Specification v1.0

This document defines the complete API contract between the AgentFlow front-end and Stephen's Microsoft 365 middleware. The front-end is fully wired up to call these endpoints — middleware just needs to implement them.

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Common Patterns](#common-patterns)
4. [Endpoints](#endpoints)
   - [Auth](#auth-endpoints)
   - [Hubs](#hub-endpoints)
   - [Proposal](#proposal-endpoints)
   - [Videos](#video-endpoints)
   - [Documents](#document-endpoints)
   - [Messages](#message-endpoints)
   - [Meetings](#meeting-endpoints)
   - [Questionnaires](#questionnaire-endpoints)
   - [Members & Access](#member-endpoints)
   - [Activity & Events](#activity-endpoints)
5. [Type Definitions](#type-definitions)
6. [Event Types](#event-types)

---

## Overview

### Base URL
```
https://api.agentflow.com/api/v1
```

### Authentication Model
- **Front-end obtains tokens for the backend API scope only** using MSAL Browser
- Token scope: `api://agentflow-backend/access_as_user`
- **Front-end NEVER requests Graph scopes** — middleware performs OBO for Graph calls
- All requests include `Authorization: Bearer <token>` header

### Data Flow
```
User → MSAL (get backend token) → Front-end → Backend API → OBO → Microsoft Graph
```

---

## Common Patterns

### Request Headers
```http
Authorization: Bearer <access_token>
Content-Type: application/json
```

### Pagination
All list endpoints support pagination:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | 1 | Page number (1-indexed) |
| `pageSize` | number | 20 | Items per page (max 100) |
| `sort` | string | - | Sort field:direction (e.g., `createdAt:desc`) |
| `filter` | string | - | Filter expression (e.g., `status:active`) |
| `search` | string | - | Full-text search query |

### Paginated Response
```json
{
  "items": [...],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "totalItems": 150,
    "totalPages": 8
  }
}
```

### Error Responses
All errors return:
```json
{
  "code": "ERROR_CODE",
  "message": "Human-readable message",
  "details": {},
  "correlationId": "uuid-for-tracing"
}
```

| Status | Code | When |
|--------|------|------|
| 400 | `VALIDATION_ERROR` | Invalid request body |
| 401 | `UNAUTHENTICATED` | No valid token |
| 403 | `FORBIDDEN` | User lacks permission |
| 404 | `NOT_FOUND` | Resource doesn't exist |
| 409 | `CONFLICT` | Duplicate resource |
| 413 | `PAYLOAD_TOO_LARGE` | File exceeds limit |
| 429 | `RATE_LIMITED` | Too many requests |
| 5xx | `INTERNAL_ERROR` | Server error |

---

## Auth Endpoints

### Get Current User
```http
GET /auth/me
```

Returns the authenticated user and their hub access.

**Response: `AuthMeResponse`**
```json
{
  "user": {
    "id": "user-123",
    "email": "hamish@goagentflow.com",
    "displayName": "Hamish Nicklin",
    "role": "staff",
    "avatarUrl": "https://...",
    "tenantId": "tenant-uuid",
    "domain": "goagentflow.com"
  },
  "hubAccess": [
    {
      "hubId": "hub-1",
      "hubName": "Whitmore & Associates",
      "accessLevel": "full_access",
      "grantedAt": "2024-01-15T10:00:00Z"
    }
  ]
}
```

### Check Hub Access
```http
GET /hubs/{hubId}/access
```

Verify user's access to a specific hub.

**Response: `HubAccessCheckResponse`**
```json
{
  "hasAccess": true,
  "accessLevel": "full_access",
  "permissions": {
    "canViewProposal": true,
    "canViewDocuments": true,
    "canViewVideos": true,
    "canViewMessages": true,
    "canViewMeetings": true,
    "canViewQuestionnaire": true,
    "canInviteMembers": true,
    "canManageAccess": true
  }
}
```

### Logout
```http
POST /auth/logout
```

Invalidate the current session.

---

## Hub Endpoints

### List Hubs
```http
GET /hubs
```

Returns paginated list of hubs the user has access to.

**Query Parameters:** Standard pagination + `filter=status:active`

**Response: `PaginatedList<Hub>`**

### Get Hub
```http
GET /hubs/{hubId}
```

**Response: `Hub`**
```json
{
  "id": "hub-1",
  "companyName": "Whitmore & Associates",
  "contactName": "Sarah Mitchell",
  "contactEmail": "sarah@whitmorelaw.co.uk",
  "status": "active",
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-20T15:30:00Z",
  "lastActivity": "2024-01-20T15:30:00Z",
  "clientsInvited": 3,
  "lastVisit": "2024-01-20T14:00:00Z",
  "clientDomain": "whitmorelaw.co.uk"
}
```

### Create Hub
```http
POST /hubs
```

**Request: `CreateHubRequest`**
```json
{
  "companyName": "Whitmore & Associates",
  "contactName": "Sarah Mitchell",
  "contactEmail": "sarah@whitmorelaw.co.uk",
  "clientDomain": "whitmorelaw.co.uk"
}
```

**Response: `Hub`**

### Update Hub
```http
PATCH /hubs/{hubId}
```

**Request: `UpdateHubRequest`**
```json
{
  "companyName": "Whitmore & Associates Ltd",
  "status": "active"
}
```

**Response: `Hub`**

### Get Hub Overview
```http
GET /hubs/{hubId}/overview
```

Dashboard data with alerts and stats.

**Response: `HubOverview`**
```json
{
  "hub": { ... },
  "alerts": [
    {
      "id": "alert-1",
      "type": "proposal_viewed",
      "title": "Sarah viewed the proposal",
      "description": "Spent 12 minutes on slides 1-8",
      "createdAt": "2024-01-20T14:00:00Z",
      "isRead": false
    }
  ],
  "internalNotes": "Follow up next week",
  "engagementStats": {
    "totalViews": 45,
    "uniqueVisitors": 3,
    "avgTimeSpent": 420,
    "lastVisit": "2024-01-20T14:00:00Z",
    "proposalViews": 12,
    "documentDownloads": 5,
    "videoWatchTime": 1800
  }
}
```

### Update Hub Notes
```http
PATCH /hubs/{hubId}/notes
```

**Request:**
```json
{
  "notes": "Internal notes text"
}
```

### Get Hub Activity Feed
```http
GET /hubs/{hubId}/activity
```

**Response: `PaginatedList<ActivityFeedItem>`**

### Get Portal Config
```http
GET /hubs/{hubId}/portal-config
```

**Response: `PortalConfig`**
```json
{
  "hubId": "hub-1",
  "isPublished": true,
  "welcomeHeadline": "Welcome to your AgentFlow Hub",
  "welcomeMessage": "We're excited to share our proposal...",
  "heroContentType": "video",
  "heroContentId": "video-1",
  "sections": {
    "showProposal": true,
    "showVideos": true,
    "showDocuments": true,
    "showMessages": true,
    "showMeetings": true,
    "showQuestionnaire": true
  }
}
```

### Update Portal Config
```http
PATCH /hubs/{hubId}/portal-config
```

**Request: `UpdatePortalConfigRequest`**

### Publish Portal
```http
POST /hubs/{hubId}/publish
```

Makes the portal live for clients.

**Response: `PortalConfig`**

---

## Proposal Endpoints

### Get Proposal (Staff)
```http
GET /hubs/{hubId}/proposal
```

Returns `null` if no proposal uploaded.

**Response: `Proposal | null`**
```json
{
  "id": "proposal-1",
  "hubId": "hub-1",
  "fileName": "AgentFlow_Proposal_v2.pptx",
  "fileSize": 5242880,
  "mimeType": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "uploadedAt": "2024-01-15T10:00:00Z",
  "uploadedBy": "user-staff-1",
  "totalSlides": 24,
  "embedUrl": "https://view.officeapps.live.com/...",
  "downloadUrl": "https://storage.blob.core.windows.net/...",
  "thumbnailUrl": "https://...",
  "settings": {
    "isClientVisible": true,
    "isDownloadEnabled": true
  },
  "versions": [
    {
      "id": "version-1",
      "versionNumber": 1,
      "uploadedAt": "2024-01-15T10:00:00Z",
      "uploadedBy": "user-staff-1",
      "uploadedByName": "Hamish Nicklin",
      "fileName": "AgentFlow_Proposal_v1.pptx"
    }
  ]
}
```

### Upload Proposal
```http
POST /hubs/{hubId}/proposal
Content-Type: multipart/form-data
```

**Form Data:**
- `file`: PowerPoint file (.pptx)
- `replaceExisting`: "true" | "false"

**Response: `Proposal`**

### Delete Proposal
```http
DELETE /hubs/{hubId}/proposal
```

### Update Proposal Settings
```http
PATCH /hubs/{hubId}/proposal/settings
```

**Request: `UpdateProposalSettingsRequest`**
```json
{
  "isClientVisible": true,
  "isDownloadEnabled": false
}
```

**Response: `Proposal`**

### Get Proposal Engagement
```http
GET /hubs/{hubId}/proposal/engagement
```

**Response: `ProposalEngagement`**
```json
{
  "totalViews": 12,
  "uniqueViewers": 3,
  "avgTimeSpent": 420,
  "totalTimeSpent": 1260,
  "lastViewedAt": "2024-01-20T14:00:00Z",
  "viewers": [
    { "id": "user-1", "name": "Sarah Mitchell", "email": "sarah@..." }
  ],
  "mostViewedSlide": 5,
  "slideViews": [
    { "slideNumber": 1, "title": "Introduction", "timeSpent": 45 }
  ],
  "slideEngagement": [
    { "slideNumber": 1, "views": 12, "avgTimeSpent": 30, "dropOffRate": 5 }
  ]
}
```

### Get Portal Proposal (Client)
```http
GET /hubs/{hubId}/portal/proposal
```

Returns `null` if not visible to client.

**Response: `Proposal | null`**

### Submit Proposal Comment (Client)
```http
POST /hubs/{hubId}/portal/proposal/comment
```

Creates a comment that spawns a message thread.

**Request: `CreateProposalCommentRequest`**
```json
{
  "slideNumber": 5,
  "content": "Can you clarify the timeline on this slide?"
}
```

**Response: `ProposalComment`**
```json
{
  "id": "comment-1",
  "proposalId": "proposal-1",
  "slideNumber": 5,
  "authorId": "user-client-1",
  "authorName": "Sarah Mitchell",
  "authorEmail": "sarah@whitmorelaw.co.uk",
  "content": "Can you clarify the timeline on this slide?",
  "createdAt": "2024-01-20T14:00:00Z",
  "threadId": "thread-123"
}
```

---

## Video Endpoints

### List Videos (Staff)
```http
GET /hubs/{hubId}/videos
```

**Response: `PaginatedList<Video>`**

### Get Video
```http
GET /hubs/{hubId}/videos/{videoId}
```

**Response: `Video`**
```json
{
  "id": "video-1",
  "hubId": "hub-1",
  "title": "Company Introduction",
  "description": "Meet the AgentFlow team",
  "sourceType": "upload",
  "sourceUrl": "https://storage.blob.core.windows.net/...",
  "thumbnailUrl": "https://...",
  "duration": 180,
  "visibility": "client",
  "uploadedAt": "2024-01-15T10:00:00Z",
  "uploadedBy": "user-staff-1",
  "uploadedByName": "Hamish Nicklin",
  "views": 8,
  "avgWatchTime": 120
}
```

### Upload Video
```http
POST /hubs/{hubId}/videos
Content-Type: multipart/form-data
```

**Form Data:**
- `file`: Video file
- `title`: string
- `description`: string (optional)
- `visibility`: "client" | "internal"

**Response: `Video`**

### Add Video Link
```http
POST /hubs/{hubId}/videos/link
```

For YouTube, Vimeo, etc.

**Request: `AddVideoLinkRequest`**
```json
{
  "title": "Product Demo",
  "description": "Full product walkthrough",
  "url": "https://youtube.com/watch?v=...",
  "visibility": "client"
}
```

**Response: `Video`**

### Update Video
```http
PATCH /hubs/{hubId}/videos/{videoId}
```

**Request: `UpdateVideoRequest`**
```json
{
  "title": "Updated Title",
  "visibility": "internal"
}
```

**Response: `Video`**

### Delete Video
```http
DELETE /hubs/{hubId}/videos/{videoId}
```

### Get Video Engagement
```http
GET /hubs/{hubId}/videos/{videoId}/engagement
```

**Response: `VideoEngagement`**
```json
{
  "videoId": "video-1",
  "totalViews": 8,
  "uniqueViewers": 3,
  "avgWatchTime": 165,
  "completionRate": 85,
  "viewHistory": [
    {
      "viewerId": "user-1",
      "viewerName": "Sarah Mitchell",
      "viewerEmail": "sarah@...",
      "watchTime": 180,
      "percentComplete": 100,
      "timestamp": "2024-01-20T14:00:00Z"
    }
  ]
}
```

### Bulk Video Action
```http
POST /hubs/{hubId}/videos/bulk
```

**Request: `BulkVideoActionRequest`**
```json
{
  "videoIds": ["video-1", "video-2"],
  "action": "delete" | "set_visibility",
  "visibility": "client"
}
```

### Get Portal Videos (Client)
```http
GET /hubs/{hubId}/portal/videos
```

Returns only client-visible videos.

**Response: `PaginatedList<Video>`**

---

## Document Endpoints

### List Documents (Staff)
```http
GET /hubs/{hubId}/documents
```

**Query Parameters:**
- Standard pagination
- `visibility`: "client" | "internal"
- `category`: "proposal" | "contract" | "reference" | "brief" | "deliverable" | "other"
- `search`: Full-text search

**Response: `PaginatedList<Document>`**

### Get Document
```http
GET /hubs/{hubId}/documents/{documentId}
```

**Response: `Document`**
```json
{
  "id": "doc-1",
  "hubId": "hub-1",
  "name": "Pricing Breakdown",
  "description": "Detailed pricing for all services",
  "fileName": "Pricing_2024.xlsx",
  "fileSize": 52428,
  "mimeType": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "category": "proposal",
  "visibility": "client",
  "uploadedAt": "2024-01-15T10:00:00Z",
  "uploadedBy": "user-staff-1",
  "uploadedByName": "Hamish Nicklin",
  "downloadUrl": "https://storage.blob.core.windows.net/...",
  "embedUrl": "https://view.officeapps.live.com/...",
  "views": 5,
  "downloads": 2,
  "versions": [...]
}
```

### Upload Document
```http
POST /hubs/{hubId}/documents
Content-Type: multipart/form-data
```

**Form Data:**
- `file`: Document file
- `name`: Display name
- `category`: DocumentCategory
- `visibility`: "client" | "internal"
- `description`: string (optional)

**Response: `Document`**

### Update Document
```http
PATCH /hubs/{hubId}/documents/{documentId}
```

**Request: `UpdateDocumentRequest`**

**Response: `Document`**

### Delete Document
```http
DELETE /hubs/{hubId}/documents/{documentId}
```

### Get Document Engagement
```http
GET /hubs/{hubId}/documents/{documentId}/engagement
```

**Response: `DocumentEngagement`**

### Bulk Document Action
```http
POST /hubs/{hubId}/documents/bulk
```

**Request: `BulkDocumentActionRequest`**
```json
{
  "documentIds": ["doc-1", "doc-2"],
  "action": "delete" | "set_visibility" | "set_category",
  "visibility": "client",
  "category": "reference"
}
```

### Get Portal Documents (Client)
```http
GET /hubs/{hubId}/portal/documents
```

**Response: `PaginatedList<Document>`**

---

## Message Endpoints

Messages are stored in/synced with Microsoft Outlook. The middleware uses email category labels to scope messages to hubs.

### List Message Threads (Staff)
```http
GET /hubs/{hubId}/messages
```

**Query Parameters:**
- Standard pagination
- `isArchived`: boolean
- `isRead`: boolean

**Response: `PaginatedList<MessageThreadSummary>`**
```json
{
  "items": [
    {
      "id": "thread-1",
      "hubId": "hub-1",
      "subject": "Re: Proposal Questions",
      "lastMessagePreview": "Thanks for clarifying the timeline...",
      "lastMessageAt": "2024-01-20T14:00:00Z",
      "messageCount": 5,
      "isRead": false,
      "isArchived": false,
      "participants": [
        { "email": "sarah@...", "name": "Sarah Mitchell", "isClient": true }
      ]
    }
  ]
}
```

### Get Message Thread
```http
GET /hubs/{hubId}/messages/{threadId}
```

**Response: `MessageThreadDetail`**
```json
{
  "id": "thread-1",
  "hubId": "hub-1",
  "subject": "Re: Proposal Questions",
  "lastMessagePreview": "...",
  "lastMessageAt": "2024-01-20T14:00:00Z",
  "messageCount": 5,
  "isRead": true,
  "isArchived": false,
  "participants": [...],
  "teamNotes": "Follow up on pricing question",
  "messages": [
    {
      "id": "msg-1",
      "threadId": "thread-1",
      "from": { "email": "sarah@...", "name": "Sarah Mitchell" },
      "to": [{ "email": "hamish@...", "name": "Hamish Nicklin" }],
      "cc": [],
      "subject": "Re: Proposal Questions",
      "bodyPreview": "Thanks for clarifying...",
      "bodyHtml": "<p>Thanks for clarifying...</p>",
      "sentAt": "2024-01-20T14:00:00Z",
      "isRead": true,
      "attachments": [
        {
          "id": "att-1",
          "name": "requirements.pdf",
          "size": 102400,
          "mimeType": "application/pdf",
          "downloadUrl": "https://..."
        }
      ]
    }
  ]
}
```

### Send Message
```http
POST /hubs/{hubId}/messages
```

**Request: `SendMessageRequest`**
```json
{
  "threadId": "thread-1",
  "to": ["sarah@whitmorelaw.co.uk"],
  "cc": [],
  "subject": "Re: Proposal Questions",
  "bodyHtml": "<p>Great question! Here's the clarification...</p>",
  "attachments": []
}
```

Omit `threadId` to start a new thread.

**Response: `Message`**

### Update Team Notes
```http
PATCH /hubs/{hubId}/messages/{threadId}/notes
```

**Request:**
```json
{
  "notes": "Internal notes for the team"
}
```

### Archive/Unarchive Thread
```http
PATCH /hubs/{hubId}/messages/{threadId}
```

**Request:**
```json
{
  "isArchived": true
}
```

### Get Portal Messages (Client)
```http
GET /hubs/{hubId}/portal/messages
```

**Response: `PaginatedList<MessageThreadSummary>`**

### Send Portal Message (Client)
```http
POST /hubs/{hubId}/portal/messages
```

**Request: `SendMessageRequest`**

**Response: `Message`**

---

## Meeting Endpoints

Meetings are created in Microsoft Teams via Graph API.

### List Meetings
```http
GET /hubs/{hubId}/meetings
```

**Query Parameters:**
- Standard pagination
- `status`: "scheduled" | "completed" | "cancelled"
- `fromDate`: ISO date string
- `toDate`: ISO date string

**Response: `PaginatedList<Meeting>`**

### Get Meeting
```http
GET /hubs/{hubId}/meetings/{meetingId}
```

**Response: `Meeting`**
```json
{
  "id": "meeting-1",
  "hubId": "hub-1",
  "title": "Project Kickoff",
  "description": "Initial project planning session",
  "startTime": "2024-01-25T14:00:00Z",
  "endTime": "2024-01-25T15:00:00Z",
  "status": "scheduled",
  "organizer": {
    "email": "hamish@goagentflow.com",
    "name": "Hamish Nicklin",
    "isOrganizer": true,
    "isClient": false,
    "responseStatus": "accepted"
  },
  "attendees": [
    {
      "email": "sarah@whitmorelaw.co.uk",
      "name": "Sarah Mitchell",
      "isOrganizer": false,
      "isClient": true,
      "responseStatus": "tentative"
    }
  ],
  "joinUrl": "https://teams.microsoft.com/l/meetup-join/...",
  "agenda": "1. Introductions\n2. Project scope...",
  "teamNotes": "Prepare demo environment",
  "recording": null,
  "transcript": null,
  "aiSummary": null
}
```

### Schedule Meeting
```http
POST /hubs/{hubId}/meetings
```

**Request: `ScheduleMeetingRequest`**
```json
{
  "title": "Project Kickoff",
  "description": "Initial project planning session",
  "startTime": "2024-01-25T14:00:00Z",
  "endTime": "2024-01-25T15:00:00Z",
  "attendeeEmails": ["sarah@whitmorelaw.co.uk"],
  "agenda": "1. Introductions\n2. Project scope..."
}
```

**Response: `Meeting`**

### Update Meeting
```http
PATCH /hubs/{hubId}/meetings/{meetingId}
```

**Request: `UpdateMeetingRequest`**

**Response: `Meeting`**

### Update Meeting Agenda
```http
PATCH /hubs/{hubId}/meetings/{meetingId}/agenda
```

**Request:**
```json
{
  "agenda": "Updated agenda..."
}
```

### Update Meeting Notes
```http
PATCH /hubs/{hubId}/meetings/{meetingId}/notes
```

**Request:**
```json
{
  "notes": "Team-only notes"
}
```

### Cancel Meeting
```http
DELETE /hubs/{hubId}/meetings/{meetingId}
```

### Get Meeting Recording (Teams Premium)
```http
GET /hubs/{hubId}/meetings/{meetingId}/recording
```

**Response:**
```json
{
  "url": "https://..." | null
}
```

### Get Meeting Transcript (Teams Premium)
```http
GET /hubs/{hubId}/meetings/{meetingId}/transcript
```

**Response:**
```json
{
  "content": "Transcript text..." | null
}
```

### Get Portal Meetings (Client)
```http
GET /hubs/{hubId}/portal/meetings
```

**Response: `PaginatedList<Meeting>`**

---

## Questionnaire Endpoints

Questionnaires link to Microsoft Forms. Due to Forms API limitations, response analytics are best-effort.

### List Questionnaires
```http
GET /hubs/{hubId}/questionnaires
```

**Response: `PaginatedList<Questionnaire>`**

### Get Questionnaire
```http
GET /hubs/{hubId}/questionnaires/{questionnaireId}
```

**Response: `Questionnaire`**
```json
{
  "id": "questionnaire-1",
  "hubId": "hub-1",
  "title": "Project Requirements",
  "description": "Help us understand your needs",
  "formUrl": "https://forms.office.com/r/abc123",
  "formId": "abc123",
  "status": "active",
  "createdAt": "2024-01-15T10:00:00Z",
  "createdBy": "user-staff-1",
  "createdByName": "Hamish Nicklin",
  "responseCount": 2,
  "completions": [
    {
      "userId": "user-client-1",
      "userName": "Sarah Mitchell",
      "userEmail": "sarah@...",
      "startedAt": "2024-01-18T10:00:00Z",
      "completedAt": "2024-01-18T10:15:00Z"
    }
  ]
}
```

### Link Questionnaire
```http
POST /hubs/{hubId}/questionnaires
```

**Request: `LinkQuestionnaireRequest`**
```json
{
  "title": "Project Requirements",
  "description": "Help us understand your needs",
  "formUrl": "https://forms.office.com/r/abc123"
}
```

**Response: `Questionnaire`**

### Update Questionnaire
```http
PATCH /hubs/{hubId}/questionnaires/{questionnaireId}
```

**Request: `UpdateQuestionnaireRequest`**

**Response: `Questionnaire`**

### Unlink Questionnaire
```http
DELETE /hubs/{hubId}/questionnaires/{questionnaireId}
```

### Get Questionnaire Analytics
```http
GET /hubs/{hubId}/questionnaires/{questionnaireId}/responses
```

**Response: `QuestionnaireAnalytics`**
```json
{
  "questionnaireId": "questionnaire-1",
  "totalResponses": 2,
  "completionRate": 66.7,
  "avgCompletionTime": 300,
  "questionSummaries": null
}
```

### Get Portal Questionnaires (Client)
```http
GET /hubs/{hubId}/portal/questionnaires
```

**Response: `PaginatedList<Questionnaire>`**

---

## Member Endpoints

### List Members
```http
GET /hubs/{hubId}/members
```

**Response: `PaginatedList<HubMember>`**

### Get Pending Invites
```http
GET /hubs/{hubId}/invites
```

**Response: `HubInvite[]`**

### Create Invite
```http
POST /hubs/{hubId}/invites
```

**Request: `CreateInviteRequest`**
```json
{
  "email": "tom@whitmorelaw.co.uk",
  "accessLevel": "view_only",
  "message": "Hey Tom, check out our proposal!"
}
```

**Note:** Domain restriction is enforced server-side. Client invites can only invite users from their domain.

**Response: `HubInvite`**

### Revoke Invite
```http
DELETE /hubs/{hubId}/invites/{inviteId}
```

### Update Member Access
```http
PATCH /hubs/{hubId}/members/{memberId}
```

**Request: `UpdateMemberAccessRequest`**
```json
{
  "accessLevel": "proposal_only"
}
```

**Response: `HubMember`**

### Remove Member
```http
DELETE /hubs/{hubId}/members/{memberId}
```

### Create Share Link
```http
POST /hubs/{hubId}/share-link
```

**Request: `CreateShareLinkRequest`**
```json
{
  "accessLevel": "view_only",
  "expiresInDays": 7,
  "maxUses": 5
}
```

**Response: `ShareLink`**
```json
{
  "id": "link-1",
  "hubId": "hub-1",
  "token": "sharetoken-abc123",
  "url": "https://hub.agentflow.com/join/sharetoken-abc123",
  "accessLevel": "view_only",
  "createdBy": "user-staff-1",
  "createdByName": "Hamish Nicklin",
  "createdAt": "2024-01-20T10:00:00Z",
  "expiresAt": "2024-01-27T10:00:00Z",
  "maxUses": 5,
  "useCount": 0,
  "isActive": true
}
```

### Accept Invite
```http
POST /invites/{token}/accept
```

**Response: `AcceptInviteResponse`**
```json
{
  "hubId": "hub-1",
  "hubName": "Whitmore & Associates",
  "accessLevel": "view_only"
}
```

### Get Member Activity
```http
GET /hubs/{hubId}/members/activity
```

**Response: `PaginatedList<MemberActivity>`**

### Get Portal Members (Client)
```http
GET /hubs/{hubId}/portal/members
```

**Response: `PaginatedList<HubMember>`**

### Invite Colleague (Client Portal)
```http
POST /hubs/{hubId}/portal/invite
```

Domain restriction enforced — clients can only invite colleagues from their email domain.

**Request:**
```json
{
  "email": "tom@whitmorelaw.co.uk",
  "accessLevel": "view_only"
}
```

**Response: `HubInvite`**

---

## Activity Endpoints

### Log Event
```http
POST /hubs/{hubId}/events
```

**Request: `LogEventRequest`**

Event type determines metadata shape (discriminated union):

```json
{
  "eventType": "hub.viewed",
  "metadata": { "section": "portal-overview" }
}
```

```json
{
  "eventType": "proposal.viewed",
  "metadata": { "proposalId": "proposal-1", "slideNum": 5 }
}
```

```json
{
  "eventType": "video.watched",
  "metadata": { "videoId": "video-1", "watchTime": 120, "percentComplete": 65 }
}
```

### Get Events (Staff Only)
```http
GET /hubs/{hubId}/events
```

**Response: `PaginatedList<ActivityEvent>`**

---

## Type Definitions

### Access Levels
```typescript
type AccessLevel = "full_access" | "proposal_only" | "documents_only" | "view_only";
```

### Hub Status
```typescript
type HubStatus = "draft" | "active" | "won" | "lost";
```

### Document Categories
```typescript
type DocumentCategory = "proposal" | "contract" | "reference" | "brief" | "deliverable" | "other";
```

### Visibility
```typescript
type DocumentVisibility = "client" | "internal";
type VideoVisibility = "client" | "internal";
```

### Meeting Status
```typescript
type MeetingStatus = "scheduled" | "completed" | "cancelled";
```

### Invite Status
```typescript
type InviteStatus = "pending" | "accepted" | "expired" | "revoked";
```

---

## Event Types

Events use strict enum values for reliable analytics:

| Event Type | Metadata |
|------------|----------|
| `hub.viewed` | `{ section: string }` |
| `proposal.viewed` | `{ proposalId, slideNum }` |
| `proposal.slide_time` | `{ proposalId, slideNum, seconds }` |
| `video.watched` | `{ videoId, watchTime, percentComplete }` |
| `video.completed` | `{ videoId }` |
| `document.viewed` | `{ documentId }` |
| `document.downloaded` | `{ documentId }` |
| `meeting.joined` | `{ meetingId }` |
| `message.sent` | `{ threadId }` |
| `message.read` | `{ threadId, messageId }` |
| `questionnaire.started` | `{ questionnaireId }` |
| `questionnaire.completed` | `{ questionnaireId }` |
| `share.sent` | `{ recipientEmail, resource: { type, id } }` |
| `share.accepted` | `{ inviteId }` |

---

## Implementation Notes for Stephen

### Priority Order
1. **Auth** (`/auth/me`, `/hubs/{hubId}/access`) — needed for app bootstrap
2. **Hubs** (`/hubs`, `/hubs/{hubId}`, `/hubs/{hubId}/overview`) — core navigation
3. **Proposal** — primary content
4. **Messages** — Outlook integration
5. **Meetings** — Teams integration
6. **Documents & Videos** — SharePoint/OneDrive
7. **Questionnaires** — Forms integration (best-effort analytics)
8. **Activity** — engagement tracking

### Microsoft Graph Mapping
| Feature | Graph API |
|---------|-----------|
| Messages | Mail API (categories for hub scoping) |
| Meetings | Calendar/Online Meetings API |
| Documents | SharePoint/OneDrive Files API |
| Proposals | SharePoint/OneDrive + Office Online |
| Questionnaires | Forms API (limited) |

### Security Considerations
- All endpoints require valid JWT from MSAL
- Middleware performs OBO for Graph calls
- Domain restriction enforced server-side for client invites
- Sanitize all HTML content before storing (bodyHtml)
- Presigned URLs for file downloads (time-limited)

---

*Document version: 1.0*
*Last updated: 2024-01-20*
*Front-end version: Phase 4 complete*
