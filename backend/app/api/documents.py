import os
import shutil
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
import uuid

from ..database import get_db
from ..models.models import Document, DocumentChunk
from ..services.document_processor import document_processor
from ..services.rag import rag_service

router = APIRouter()

UPLOAD_DIR = "uploads/documents"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.get("", response_model=List[dict])
async def list_documents(
    db: AsyncSession = Depends(get_db),
    organization_id: str | None = None,
):
    """
    Список документов в базе знаний (id, filename, file_type, created_at).
    Для MVP пагинация не реализована.
    """
    stmt = select(Document).order_by(Document.created_at.desc())
    if organization_id:
        stmt = stmt.where(Document.organization_id == organization_id)
    result = await db.execute(stmt)
    docs = result.scalars().all()
    return [
        {
            "id": str(doc.id),
            "filename": doc.filename,
            "file_type": doc.file_type or "",
            "created_at": doc.created_at.isoformat() if doc.created_at else None,
        }
        for doc in docs
    ]


@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    organization_id: str = "00000000-0000-0000-0000-000000000000" # Placeholder
):
    """
    Uploads a document, extracts text, chunks it, and saves to database.
    """
    file_ext = os.path.splitext(file.filename)[1]
    if file_ext.lower() not in [".pdf", ".docx", ".txt"]:
        raise HTTPException(status_code=400, detail="Unsupported file format")

    # 1. Save file to disk
    document_id = uuid.uuid4()
    file_path = os.path.join(UPLOAD_DIR, f"{document_id}{file_ext}")
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        # 2. Extract text
        with open(file_path, "rb") as f:
            content = f.read()
        
        text = document_processor.extract_text(content, file_ext)
        
        # 3. Create Document record
        db_doc = Document(
            id=document_id,
            organization_id=organization_id,
            filename=file.filename,
            file_type=file_ext.replace(".", ""),
            file_size=os.path.getsize(file_path),
            storage_path=file_path
        )
        db.add(db_doc)
        await db.flush()

        # 4. Chunk and Create Embedding placeholders (Embeddings will be generated in background task in future)
        chunks = document_processor.chunk_text(text)
        for chunk_text in chunks:
            db_chunk = DocumentChunk(
                document_id=document_id,
                content=chunk_text,
                embedding=None # TODO: Generate embedding using DeepSeek or Natasha
            )
            db.add(db_chunk)
        
        await db.commit()
        return {"id": str(document_id), "filename": file.filename, "status": "processed"}

    except Exception as e:
        await db.rollback()
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(status_code=500, detail=f"Failed to process document: {str(e)}")
