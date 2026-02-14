from fastapi import APIRouter

from .llm import router as llm_router
from .legal import router as legal_router

api_router = APIRouter()

api_router.include_router(llm_router, prefix="/llm", tags=["llm"])
api_router.include_router(legal_router, prefix="/legal", tags=["legal"])

@api_router.get("/status")
async def get_status():
    return {"status": "backend is running"}
