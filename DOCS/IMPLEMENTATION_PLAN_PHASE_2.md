# Implementation Plan - Phase 2: RAG Production & PII Robustness

This plan outlines the next steps for the AI-Assistant (ЖКХ) project after the successful integration of DeepSeek AI and initial RAG setup.

## 1. Robust PII Masking (ФЗ-152 Compliance)
Current masking is a simple regex placeholder. We need a production-ready solution.
- [ ] Research and implement a robust PII detection logic (using `spacy` with Russian models or specialized libraries like `presidio`).
- [ ] Create a dedicated `PIIService` to handle bidirectional masking (masking before LLM, unmasking before UI).
- [ ] Update `LLMService` to use the new `PIIService`.

## 2. Document Indexing Pipeline
The database is ready, but we need automated ingestion.
- [ ] **File Upload API**: Create an endpoint `/api/v1/documents/upload` to accept files.
- [ ] **Document Processor**:
    - [ ] Implement text extraction for PDF, DOCX, and TXT.
    - [ ] Implement semantic chunking (splitting documents into meaningful segments).
    - [ ] Generate embeddings for each chunk using an embedding model (e.g., DeepSeek's embedding or a local HuggingFace model).
- [ ] **Background Tasks**: Use `FastAPI BackgroundTasks` for processing large files to keep the API responsive.

## 3. Legal Consultant Refinement
- [ ] Replace mock sources in the UI with real data from the vector search.
- [ ] Implement "Contextual Quality Control": Validate that the LLM response actually uses the retrieved chunks.
- [ ] Improve citation rendering (links to source documents).

## 4. Module "Supervision Responses" (Ответы надзору)
- [ ] Implement the core logic for analyzing regulatory requirements against existing company documentation.
- [ ] Use RAG to find relevant company policies or previous responses to similar audit requests.

## 5. Security & Authentication
- [ ] Implement JWT-based login for staff and admins.
- [ ] Configure Role-Based Access Control (RBAC) to restrict access to sensitive document management.

## 6. Frontend Polish
- [ ] Add a "Knowledge Base" management UI in the Admin Panel.
- [ ] Improve the mobile responsiveness of the Legal Consultant module.
