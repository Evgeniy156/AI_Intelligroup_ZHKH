from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from app.services.llm import llm_service

router = APIRouter()

class SearchRequest(BaseModel):
    query: str
    provider: str = "gigachat" # Для юридических вопросов по умолчанию GigaChat (как в UI)

class LegalSource(BaseModel):
    id: int
    title: str
    type: str
    content: str
    relevance: float
    citation: str

class SearchResponse(BaseModel):
    answer: str
    sources: List[dict]
    risks: List[dict]

@router.post("/ask", response_model=SearchResponse)
async def ask_legal(request: SearchRequest):
    """
    Эндпоинт для юридической консультации (RAG).
    Находит релевантные законы и генерирует на их основе ответ.
    """
    try:
        # Простейшая имитация RAG:
        # 1. Поиск в "базе знаний" (пока мокаем на стороне бэкенда)
        sources = [
            {
                "id": 1,
                "title": "Жилищный кодекс РФ",
                "type": "law",
                "content": "Собственники помещений в многоквартирном доме обязаны выбрать один из способов управления...",
                "relevance": 0.95,
                "citation": "Ст. 161 ЖК РФ"
            },
            {
                "id": 2,
                "title": "Постановление Правительства №354",
                "type": "law",
                "content": "Исполнитель обязан предоставлять потребителю коммунальные услуги в необходимых объемах...",
                "relevance": 0.88,
                "citation": "Раздел IV, п. 31"
            }
        ]

        # 2. Формируем расширенный промпт для ИИ
        context = "\n".join([s["content"] for s in sources])
        prompt = f"Контекст из законов:\n{context}\n\nВопрос пользователя: {request.query}\nОтветь максимально подробно, ссылаясь на статьи."

        # 3. Генерация ответа через LLM
        answer = await llm_service.generate_response(prompt, provider=request.provider)

        # 4. Мокаем риски для полноты ответа (в будущем — отдельный LLM промпт)
        risks = [
            {
                "category": "Административный риск",
                "level": "medium",
                "description": "Риск нарушения порядка выбора способа управления.",
                "recommendation": "Проверьте протокол общего собрания на наличие кворума."
            }
        ]

        return SearchResponse(
            answer=answer,
            sources=sources,
            risks=risks
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
