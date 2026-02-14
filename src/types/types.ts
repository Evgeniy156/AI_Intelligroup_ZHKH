// ============================================================
// Общие типы проекта AI-Помощник ЖКХ
// ============================================================

// --- Модуль «Ответы на обращения» ---

export interface PIIMapping {
    original: string;
    masked: string;
}

export interface RAGResult {
    id: number;
    title: string;
    similarity: number;
    source: string;
}

export type RiskLevel = "low" | "medium" | "high";

export interface ResponseVariant {
    id: string;
    title: string;
    content: string;
    tone: string;
    riskLevel: RiskLevel;
}

export interface GenerateOptions {
    tone?: string;
    maxVariants?: number;
}

export interface GenerateResult {
    responses: ResponseVariant[];
    ragResults: RAGResult[];
    piiMappings: PIIMapping[];
}

// --- Модуль «Юридический консультант» ---

export type LegalSourceType = "law" | "practice" | "template";

export interface LegalSource {
    id: string;
    title: string;
    type: LegalSourceType;
    citation: string;
    relevance: number;
    content: string;
}

export interface RiskAssessment {
    level: RiskLevel;
    category: string;
    description: string;
    recommendation: string;
}

export interface LegalSearchResult {
    answer: string;
    sources: LegalSource[];
    risks: RiskAssessment[];
}

// --- Модуль «Ответы надзору» ---

export type ComplianceStatus = "complied" | "partial" | "violation";
export type AuditStatus = "passed" | "warning" | "failed";

export interface DocumentRequirement {
    id: string;
    requirement: string;
    legalBasis: string;
    status: ComplianceStatus;
    documents: string[];
}

export interface AuditCheck {
    id: number;
    check: string;
    status: AuditStatus;
}

export interface AnalysisResult {
    requirements: DocumentRequirement[];
    auditChecks: AuditCheck[];
    documentInfo: {
        sender: string;
        number: string;
        date: string;
        deadline: string;
    };
}

// --- Админ-панель ---

export type UserRole = "admin" | "employee" | "viewer";
export type UserStatus = "active" | "inactive";

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    status: UserStatus;
    lastActive: string;
}

export interface LLMSettings {
    provider: "yandex" | "sber" | "deepseek";
    model: string;
    temperature: number;
    maxTokens: number;
}

export interface OrganizationSettings {
    name: string;
    inn: string;
    address: string;
    phone: string;
    email: string;
    autoSignature: boolean;
    emailNotifications: boolean;
}

// --- Dashboard ---

export type TrendDirection = "up" | "down";
export type ActivityType = "request" | "legal" | "supervision";
export type ActivityStatus = "completed" | "processing" | "draft";

export interface DashboardStat {
    label: string;
    value: string;
    change: string;
    trend: TrendDirection;
    icon: string;
}

export interface ActivityItem {
    id: number;
    type: ActivityType;
    title: string;
    status: ActivityStatus;
    time: string;
    risk: RiskLevel;
}

export interface ModuleInfo {
    id: string;
    title: string;
    description: string;
    color: string;
    features: string[];
}
