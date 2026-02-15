"""
Модуль «Ответы надзору»: анализ предписаний и генерация ответа через LLM.
"""
import os
import uuid
from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel

from ..services.document_processor import document_processor
from ..services.llm import llm_service

router = APIRouter()

# In-memory store for MVP: analysis_id -> extracted text (for generate step)
_analysis_store: dict[str, str] = {}

ALLOWED_EXTENSIONS = {".pdf", ".docx", ".txt"}


def _build_analysis_result(extracted_text: str, analysis_id: str) -> dict:
    """Build AnalysisResult-shaped dict from extracted text for frontend."""
    lines = [s.strip() for s in extracted_text.split("\n") if s.strip()][:10]
    requirements = [
        {
            "id": str(i + 1),
            "requirement": line[:200] if len(line) > 200 else line,
            "legalBasis": "Из текста предписания",
            "status": "partial",
            "documents": [],
        }
        for i, line in enumerate(lines[:5])
    ]
    if not requirements:
        requirements = [
            {
                "id": "1",
                "requirement": "Требования извлечены из документа (текст для контекста).",
                "legalBasis": "Текст предписания",
                "status": "partial",
                "documents": [],
            }
        ]
    audit_checks = [
        {"id": 1, "check": "Отсутствие признания вины", "status": "passed"},
        {"id": 2, "check": "Соблюдение процедуры", "status": "passed"},
        {"id": 3, "check": "Правильные ссылки на нормы", "status": "warning"},
    ]
    document_info = {
        "sender": "Надзорный орган",
        "number": "—",
        "date": "—",
        "deadline": "—",
    }
    return {
        "id": analysis_id,
        "requirements": requirements,
        "auditChecks": audit_checks,
        "documentInfo": document_info,
    }


@router.post("/analyze")
async def analyze_document(file: UploadFile = File(...)) -> dict:
    """
    Принимает предписание (PDF/DOCX/TXT), извлекает текст и возвращает
    структурированный анализ для UI + id для последующей генерации ответа.
    """
    ext = os.path.splitext(file.filename or "")[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Неподдерживаемый формат. Допустимы: {', '.join(ALLOWED_EXTENSIONS)}",
        )
    content = await file.read()
    if not content:
        raise HTTPException(status_code=400, detail="Файл пустой")
    try:
        text = document_processor.extract_text(content, ext)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Ошибка извлечения текста: {str(e)}")
    analysis_id = str(uuid.uuid4())
    _analysis_store[analysis_id] = text
    return _build_analysis_result(text, analysis_id)


class GenerateRequest(BaseModel):
    analysis_id: str


@router.post("/generate")
async def generate_response(request: GenerateRequest) -> dict:
    """
    Генерирует текст ответа надзорному органу по сохранённому анализу (analysis_id).
    """
    text = _analysis_store.get(request.analysis_id)
    if not text:
        raise HTTPException(
            status_code=404,
            detail="Анализ не найден. Сначала загрузите и проанализируйте документ.",
        )
    prompt = (
        "По результатам анализа предписания надзорного органа сформируй официальный ответ управляющей организации. "
        "Ответ должен быть в деловом стиле, со ссылками на нормы права. Кратко перескажи выявленные требования и дай ответ по каждому.\n\n"
        "Текст предписания (фрагмент):\n"
    ) + text[:4000]
    response_text = await llm_service.generate_response(prompt, provider="deepseek")
    return {"response": response_text}
