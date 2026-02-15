import { post, uploadFile } from "./client";
import type { AnalysisResult } from "@/types/types";

export type AnalysisResultWithId = AnalysisResult & { id: string };

/** Загрузка и анализ документа надзорного органа */
export function analyzeDocument(file: File): Promise<AnalysisResultWithId> {
    return uploadFile<AnalysisResultWithId>("/api/v1/supervision/analyze", file);
}

/** Генерация ответа надзорному органу */
export function generateSupervisionResponse(
    analysisId: string,
): Promise<{ response: string }> {
    return post<{ response: string }>("/api/v1/supervision/generate", {
        analysis_id: analysisId,
    });
}
