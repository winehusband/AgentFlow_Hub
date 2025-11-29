/**
 * Questionnaire service
 *
 * Operations for Microsoft Forms integration.
 * Links questionnaires by URL and tracks completion status.
 * Detailed response analytics are optional/best-effort due to Forms API limitations.
 */

import type {
  Questionnaire,
  LinkQuestionnaireRequest,
  UpdateQuestionnaireRequest,
  QuestionnaireAnalytics,
  PaginatedList,
  PaginationParams,
} from "@/types";
import { api, isMockApiEnabled, simulateDelay } from "./api";
import { mockQuestionnaires } from "./mock-data";

/**
 * Get questionnaires for a hub
 */
export async function getQuestionnaires(
  hubId: string,
  params?: PaginationParams
): Promise<PaginatedList<Questionnaire>> {
  if (isMockApiEnabled()) {
    await simulateDelay(300);

    const filtered = mockQuestionnaires.filter((q) => q.hubId === hubId);

    return {
      items: filtered,
      pagination: {
        page: 1,
        pageSize: 20,
        totalItems: filtered.length,
        totalPages: 1,
      },
    };
  }

  const queryParams: Record<string, string> = {};
  if (params?.page) queryParams.page = String(params.page);
  if (params?.pageSize) queryParams.pageSize = String(params.pageSize);

  return api.get<PaginatedList<Questionnaire>>(`/hubs/${hubId}/questionnaires`, queryParams);
}

/**
 * Get single questionnaire by ID
 */
export async function getQuestionnaire(
  hubId: string,
  questionnaireId: string
): Promise<Questionnaire> {
  if (isMockApiEnabled()) {
    await simulateDelay(200);
    const questionnaire = mockQuestionnaires.find((q) => q.id === questionnaireId);
    if (!questionnaire) throw new Error("Questionnaire not found");
    return questionnaire;
  }

  return api.get<Questionnaire>(`/hubs/${hubId}/questionnaires/${questionnaireId}`);
}

/**
 * Link a Microsoft Forms questionnaire to a hub
 */
export async function linkQuestionnaire(
  hubId: string,
  data: LinkQuestionnaireRequest
): Promise<Questionnaire> {
  if (isMockApiEnabled()) {
    await simulateDelay(500);

    // Extract form ID from URL
    const formIdMatch = data.formUrl.match(/\/r\/([a-zA-Z0-9]+)/);
    const formId = formIdMatch ? formIdMatch[1] : `form-${Date.now()}`;

    const newQuestionnaire: Questionnaire = {
      id: `questionnaire-${Date.now()}`,
      hubId,
      title: data.title,
      description: data.description || null,
      formUrl: data.formUrl,
      formId,
      status: "active",
      createdAt: new Date().toISOString(),
      createdBy: "user-staff-1",
      createdByName: "Hamish Nicklin",
      responseCount: 0,
      completions: [],
    };

    mockQuestionnaires.push(newQuestionnaire);
    return newQuestionnaire;
  }

  return api.post<Questionnaire>(`/hubs/${hubId}/questionnaires`, data);
}

/**
 * Update questionnaire details
 */
export async function updateQuestionnaire(
  hubId: string,
  questionnaireId: string,
  data: UpdateQuestionnaireRequest
): Promise<Questionnaire> {
  if (isMockApiEnabled()) {
    await simulateDelay(300);

    const index = mockQuestionnaires.findIndex((q) => q.id === questionnaireId);
    if (index === -1) throw new Error("Questionnaire not found");

    mockQuestionnaires[index] = { ...mockQuestionnaires[index], ...data };
    return mockQuestionnaires[index];
  }

  return api.patch<Questionnaire>(`/hubs/${hubId}/questionnaires/${questionnaireId}`, data);
}

/**
 * Unlink (delete) questionnaire from hub
 */
export async function unlinkQuestionnaire(
  hubId: string,
  questionnaireId: string
): Promise<void> {
  if (isMockApiEnabled()) {
    await simulateDelay(300);
    const index = mockQuestionnaires.findIndex((q) => q.id === questionnaireId);
    if (index !== -1) mockQuestionnaires.splice(index, 1);
    return;
  }

  return api.delete(`/hubs/${hubId}/questionnaires/${questionnaireId}`);
}

/**
 * Get questionnaire analytics (optional/best-effort)
 * May return limited data due to Forms API limitations
 */
export async function getQuestionnaireAnalytics(
  hubId: string,
  questionnaireId: string
): Promise<QuestionnaireAnalytics> {
  if (isMockApiEnabled()) {
    await simulateDelay(300);

    const questionnaire = mockQuestionnaires.find((q) => q.id === questionnaireId);
    const completedCount = questionnaire?.completions.filter((c) => c.completedAt).length || 0;
    const totalInvited = questionnaire?.completions.length || 1;

    return {
      questionnaireId,
      totalResponses: completedCount,
      completionRate: (completedCount / totalInvited) * 100,
      avgCompletionTime: 300, // 5 minutes mock
      questionSummaries: null, // Not available in mock
    };
  }

  return api.get<QuestionnaireAnalytics>(`/hubs/${hubId}/questionnaires/${questionnaireId}/responses`);
}

/**
 * Get client-facing questionnaires (portal view)
 */
export async function getPortalQuestionnaires(
  hubId: string,
  params?: PaginationParams
): Promise<PaginatedList<Questionnaire>> {
  if (isMockApiEnabled()) {
    await simulateDelay(300);

    const filtered = mockQuestionnaires.filter(
      (q) => q.hubId === hubId && q.status === "active"
    );

    return {
      items: filtered,
      pagination: { page: 1, pageSize: 20, totalItems: filtered.length, totalPages: 1 },
    };
  }

  return api.get<PaginatedList<Questionnaire>>(`/hubs/${hubId}/portal/questionnaires`);
}
