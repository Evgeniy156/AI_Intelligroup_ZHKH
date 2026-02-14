import { post, uploadFile } from "./client";
import type { AnalysisResult } from "@/types/types";

/** Загрузка и анализ документа надзорного органа */
export function analyzeDocument(file: File): Promise<AnalysisResult> {
    return uploadFile<AnalysisResult>("/api/v1/supervision/analyze", file);
}

/** Генерация ответа надзорному органу */
export function generateSupervisionResponse(
    analysisId: string,
): Promise<{ response: string }> {
    return post<{ response: string }>("/api/v1/supervision/generate", {
        analysis_id: analysisId,
    });
}
