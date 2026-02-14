import { get, post, put, del } from "./client";
import type { User, LLMSettings, OrganizationSettings } from "@/types/types";

// --- Пользователи ---

export function getUsers(): Promise<User[]> {
    return get<User[]>("/api/v1/admin/users");
}

export function createUser(data: Omit<User, "id" | "lastActive">): Promise<User> {
    return post<User>("/api/v1/admin/users", data);
}

export function updateUser(id: string, data: Partial<User>): Promise<User> {
    return put<User>(`/api/v1/admin/users/${id}`, data);
}

export function deleteUser(id: string): Promise<void> {
    return del<void>(`/api/v1/admin/users/${id}`);
}

// --- Настройки ---

export function getOrgSettings(): Promise<OrganizationSettings> {
    return get<OrganizationSettings>("/api/v1/admin/settings/organization");
}

export function updateOrgSettings(data: Partial<OrganizationSettings>): Promise<OrganizationSettings> {
    return put<OrganizationSettings>("/api/v1/admin/settings/organization", data);
}

export function getLLMSettings(): Promise<LLMSettings> {
    return get<LLMSettings>("/api/v1/admin/settings/llm");
}

export function updateLLMSettings(data: Partial<LLMSettings>): Promise<LLMSettings> {
    return put<LLMSettings>("/api/v1/admin/settings/llm", data);
}
