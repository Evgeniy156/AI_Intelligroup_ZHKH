from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from ..services.llm import llm_service

router = APIRouter()

class GenerateRequest(BaseModel):
    prompt: str
    provider: str = "deepseek"
    deepseek_key: Optional[str] = None

class GenerateResponse(BaseModel):
    content: str
    provider: str

@router.post("/generate", response_model=GenerateResponse)
async def generate_text(request: GenerateRequest):
    """
    Эндпоинт для генерации текста через LLM.
    Принимает промпт и необязательный ключ DeepSeek.
    """
    try:
        result = await llm_service.generate_response(
            prompt=request.prompt, 
            provider=request.provider,
            deepseek_key=request.deepseek_key
        )
        return GenerateResponse(content=result, provider=request.provider)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
