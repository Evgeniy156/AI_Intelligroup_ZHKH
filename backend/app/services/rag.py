import httpx
from typing import List, Optional
from sqlalchemy import select, text
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
        """
        query_vector = await self.get_embeddings(query)
        
        # SQL-запрос с использованием оператора <=> (cosine distance) из pgvector
        # Мы используем строковый запрос, так как pgvector операторы специфичны для Postgres
        stmt = (
            select(DocumentChunk)
            .order_by(DocumentChunk.embedding.cosine_distance(query_vector))
            .limit(limit)
        )
        
        result = await db.execute(stmt)
        return list(result.scalars().all())

rag_service = RAGService()
