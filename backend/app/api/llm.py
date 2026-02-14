from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.services.llm import llm_service

router = APIRouter()

class GenerateRequest(BaseModel):
    prompt: str
    provider: str = "yandex"
    alice_key: Optional[str] = None
    gigachat_key: Optional[str] = None

class GenerateResponse(BaseModel):
    content: str
    provider: str

@router.post("/generate", response_model=GenerateResponse)
async def generate_text(request: GenerateRequest):
    """
    Эндпоинт для генерации текста через LLM.
    Принимает промпт и необязательные ключи (если они переданы с фронтенда).
    """
    try:
        # Если ключи переданы в запросе, используем их
        # В реальном приложении здесь должна быть более сложная логика приоритетов
        result = await llm_service.generate_response(
            prompt=request.prompt, 
            provider=request.provider,
            yandex_key=request.alice_key,
            gigachat_key=request.gigachat_key
        )
        return GenerateResponse(content=result, provider=request.provider)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
