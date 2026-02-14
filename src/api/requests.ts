import { post } from "./client";
import type { GenerateResult, PIIMapping } from "@/types/types";

export interface MaskPIIRequest {
    text: string;
}

export interface GenerateResponseRequest {
    text: string;
    tone?: string;
    maxVariants?: number;
}

/** Маскирование ПДн (ФЗ-152) */
export function maskPII(text: string): Promise<PIIMapping[]> {
    return post<PIIMapping[]>("/api/v1/requests/mask-pii", { text });
}

/** Генерация ответа на обращение */
export function generateResponse(
    text: string,
    tone?: string,
): Promise<GenerateResult> {
    return post<GenerateResult>("/api/v1/requests/generate", { text, tone });
}
