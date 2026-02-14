# ============================================================
# Точка входа FastAPI
# ============================================================

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware

from app.config import settings
from app.api.router import api_router
from app.database import engine


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup / shutdown lifecycle."""
    # startup
    yield
    # shutdown
    await engine.dispose()


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="SaaS-платформа для автоматизации работы УК и ТСЖ",
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
    lifespan=lifespan,
)

# --- Middleware ---

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

if not settings.DEBUG:
    app.add_middleware(TrustedHostMiddleware, allowed_hosts=["*"])

# --- Routes ---

app.include_router(api_router, prefix="/api/v1")


@app.get("/health")
async def health():
    return {
        "status": "ok",
        "version": settings.APP_VERSION,
        "pii_masking": settings.PII_MASKING_ENABLED,
        "yandex_configured": settings.YANDEX_API_KEY is not None,
        "gigachat_configured": settings.GIGACHAT_API_KEY is not None,
    }
