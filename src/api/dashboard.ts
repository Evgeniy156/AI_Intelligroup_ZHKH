import { get } from "./client";

export interface DashboardStatsResponse {
    processedRequests: number;
    generatedResponses: number;
    legalConsultations: number;
    supervisionResponses: number;
    requestsChange: string;
    responsesChange: string;
    legalChange: string;
    supervisionChange: string;
}

export function getDashboardStats(): Promise<DashboardStatsResponse> {
    return get<DashboardStatsResponse>("/api/v1/dashboard/stats");
}
