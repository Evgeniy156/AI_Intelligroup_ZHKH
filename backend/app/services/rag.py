import httpx
from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from ..models.models import DocumentChunk
from ..config import settings

class RAGService:
    async def get_embeddings(self, text: str) -> List[float]:
        """
        Генерация эмбеддингов для текста.
        Пока используем заглушку или API (OpenAI/Yandex).
        """
        # В реальном проекте здесь будет запрос к API
        # Например, Yandex Embeddings или OpenAI
        # Для демонстрации возвращаем вектор из нулей нужной размерности
        return [0.0] * 1536

    async def find_relevant_chunks(
        self, 
        db: AsyncSession, 
        query: str, 
        limit: int = 3
    ) -> List[DocumentChunk]:
        """
        Поиск наиболее релевантных кусков текста в векторной БД.
        Возвращает только чанки с заполненным embedding (защита от NULL).
        """
        query_vector = await self.get_embeddings(query)
        
        stmt = (
            select(DocumentChunk)
            .where(DocumentChunk.embedding.isnot(None))
            .options(selectinload(DocumentChunk.document))
            .order_by(DocumentChunk.embedding.cosine_distance(query_vector))
            .limit(limit)
        )
        
        result = await db.execute(stmt)
        return list(result.scalars().all())

rag_service = RAGService()
