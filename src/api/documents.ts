import { get, uploadFile } from "./client";

export interface DocumentItem {
  id: string;
  filename: string;
  file_type: string;
  created_at: string | null;
}

export function getDocuments(): Promise<DocumentItem[]> {
  return get<DocumentItem[]>("/api/v1/documents");
}

export function uploadDocument(file: File): Promise<{ id: string; filename: string; status: string }> {
  return uploadFile<{ id: string; filename: string; status: string }>("/api/v1/documents/upload", file);
}
