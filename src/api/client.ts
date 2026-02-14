// ============================================================
// HTTP-клиент для взаимодействия с бэкендом
// ============================================================

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
    accessToken = token;
}

export function getAccessToken(): string | null {
    return accessToken;
}

export class ApiError extends Error {
    constructor(
        public status: number,
        public detail: string,
    ) {
        super(`API Error ${status}: ${detail}`);
        this.name = "ApiError";
    }
}

async function request<T>(
    path: string,
    options: RequestInit = {},
): Promise<T> {
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(options.headers as Record<string, string>),
    };

    if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const response = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        if (response.status === 401) {
            setAccessToken(null);
            // В реальном приложении — редирект на логин
        }

        let detail = "Unknown error";
        try {
            const body = await response.json();
            detail = body.detail ?? JSON.stringify(body);
        } catch {
            detail = response.statusText;
        }

        throw new ApiError(response.status, detail);
    }

    return response.json() as Promise<T>;
}

export function get<T>(path: string): Promise<T> {
    return request<T>(path, { method: "GET" });
}

export function post<T>(path: string, body?: unknown): Promise<T> {
    return request<T>(path, {
        method: "POST",
        body: body ? JSON.stringify(body) : undefined,
    });
}

export function put<T>(path: string, body?: unknown): Promise<T> {
    return request<T>(path, {
        method: "PUT",
        body: body ? JSON.stringify(body) : undefined,
    });
}

export function del<T>(path: string): Promise<T> {
    return request<T>(path, { method: "DELETE" });
}

export async function uploadFile<T>(path: string, file: File): Promise<T> {
    const formData = new FormData();
    formData.append("file", file);

    const headers: Record<string, string> = {};
    if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const response = await fetch(`${BASE_URL}${path}`, {
        method: "POST",
        headers,
        body: formData,
    });

    if (!response.ok) {
        let detail = "Upload failed";
        try {
            const body = await response.json();
            detail = body.detail ?? JSON.stringify(body);
        } catch {
            detail = response.statusText;
        }
        throw new ApiError(response.status, detail);
    }

    return response.json() as Promise<T>;
}

export async function checkHealth(): Promise<{ status: string; version: string }> {
    return get<{ status: string; version: string }>("/health");
}
