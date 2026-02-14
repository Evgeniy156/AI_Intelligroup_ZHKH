# ============================================================
# Pydantic Schemas — request/response validation
# ============================================================

from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime


# --- Auth ---

class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1)


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class RefreshRequest(BaseModel):
    refresh_token: str


# --- PII ---

class PIIMapping(BaseModel):
    original: str
    masked: str


class MaskPIIRequest(BaseModel):
    text: str = Field(min_length=1, max_length=50000)


class MaskPIIResponse(BaseModel):
    masked_text: str
    mappings: list[PIIMapping]


# --- Requests module ---

class GenerateRequest(BaseModel):
    text: str = Field(min_length=1, max_length=50000)
    tone: Optional[str] = None


class ResponseVariant(BaseModel):
    id: str
    title: str
    content: str
    tone: str
    risk_level: str


class RAGResult(BaseModel):
    id: int
    title: str
    similarity: float
    source: str


class GenerateResponse(BaseModel):
    responses: list[ResponseVariant]
    rag_results: list[RAGResult]
    pii_mappings: list[PIIMapping]


# --- Legal ---

class LegalSearchRequest(BaseModel):
    query: str = Field(min_length=1, max_length=5000)


class LegalSource(BaseModel):
    id: str
    title: str
    type: str
    citation: str
    relevance: float
    content: str


class RiskAssessment(BaseModel):
    level: str
    category: str
    description: str
    recommendation: str


class LegalSearchResponse(BaseModel):
    answer: str
    sources: list[LegalSource]
    risks: list[RiskAssessment]


# --- Supervision ---

class SupervisionGenerateRequest(BaseModel):
    analysis_id: str


class SupervisionGenerateResponse(BaseModel):
    response: str


# --- Admin ---

class UserOut(BaseModel):
    id: str
    name: str
    email: str
    role: str
    status: str
    last_active: Optional[str] = None

    model_config = {"from_attributes": True}


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str = Field(min_length=10)
    role: str = "employee"


class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    role: Optional[str] = None
    is_active: Optional[bool] = None


class LLMSettingsSchema(BaseModel):
    provider: str = "deepseek"
    model: str = "deepseek-chat"
    temperature: float = Field(ge=0.0, le=1.0, default=0.7)
    max_tokens: int = Field(ge=1, le=8192, default=2048)


# --- Dashboard ---

class DashboardStatsResponse(BaseModel):
    processed_requests: int
    generated_responses: int
    legal_consultations: int
    supervision_responses: int
    requests_change: str
    responses_change: str
    legal_change: str
    supervision_change: str
