from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from .llm import llm_service
from ..services.rag import rag_service
from ..database import get_db

router = APIRouter()

class SearchRequest(BaseModel):
    query: str
    provider: str = "deepseek" # По умолчанию DeepSeek

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
async def ask_legal(request: SearchRequest, db: AsyncSession = Depends(get_db)):
    """
    Эндпоинт для юридической консультации (RAG).
    Находит релевантные законы и генерирует на их основе ответ.
    """
    try:
        # 1. Поиск в векторной базе знаний (реальный RAG)
        relevant_chunks = await rag_service.find_relevant_chunks(db, request.query)
        
        if not relevant_chunks:
            # Если в базе ничего нет, используем моковые данные для обратной совместимости
            sources = [
                {
                    "id": 1,
                    "title": "Жилищный кодекс РФ (Пример)",
                    "type": "law",
                    "content": "Собственники помещений в многоквартирном доме обязаны выбрать один из способов управления...",
                    "relevance": 0.95,
                    "citation": "Ст. 161 ЖК РФ"
                }
            ]
        else:
            sources = [
                {
                    "id": i + 1,
                    "title": chunk.document.filename if hasattr(chunk, 'document') else "Документ",
                    "type": "law",
                    "content": chunk.content,
                    "relevance": 0.9, # В будущем считать на основе cosine similarity
                    "citation": str(chunk.meta_info) if chunk.meta_info else "Не указано"
                }
                for i, chunk in enumerate(relevant_chunks)
            ]

        # 2. Формируем расширенный промпт для ИИ
        context = "\n".join([str(s["content"]) for s in sources])
        prompt = f"Контекст из законов:\n{context}\n\nВопрос пользователя: {request.query}\nОтветь максимально подробно, ссылаясь на статьи."

        # 3. Генерация ответа через LLM (DeepSeek)
        answer = await llm_service.generate_response(prompt, provider=request.provider)

        # 4. Мокаем риски (пока)
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
