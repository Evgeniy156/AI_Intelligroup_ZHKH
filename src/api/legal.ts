import { post } from "./client";
import type { LegalSearchResult } from "@/types/types";

/** Юридический поиск по базе знаний */
export function searchLegal(query: string): Promise<LegalSearchResult> {
    return post<LegalSearchResult>("/api/v1/legal/search", { query });
}
