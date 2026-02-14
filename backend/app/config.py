# ============================================================
# FastAPI — конфигурация через переменные окружения
# ============================================================
# Все API-ключи задаются через .env файл или переменные окружения.
# Пример:
#   YANDEX_API_KEY=AQVN...
#   YANDEX_FOLDER_ID=b1g...
#   GIGACHAT_API_KEY=...
# ============================================================

from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """
    Все секреты читаются ТОЛЬКО из переменных окружения / .env файла.
    В коде НЕТ значений по умолчанию для ключей — при отсутствии ключа
    сервис корректно стартует, но LLM-функции вернут заглушки.
    """

    # --- Database ---
    DATABASE_URL: str = "postgresql+asyncpg://zhkh_user:changeme@localhost:5432/zhkh_db"
    REDIS_URL: str = "redis://localhost:6379/0"

    # --- JWT ---
    JWT_SECRET_KEY: str = "CHANGE_ME_IN_PRODUCTION_USE_openssl_rand_hex_32"
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    JWT_REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # --- YandexGPT (через yandex-ai-studio-sdk) ---
    YANDEX_API_KEY: Optional[str] = None          # API-ключ YandexGPT
    YANDEX_FOLDER_ID: Optional[str] = None        # ID каталога в Yandex Cloud
    YANDEX_GPT_MODEL: str = "yandexgpt"           # Имя модели

    # --- GigaChat (Сбер) ---
    GIGACHAT_API_KEY: Optional[str] = None         # API-ключ GigaChat
    GIGACHAT_MODEL: str = "GigaChat-Pro"           # Имя модели

    # --- Security ---
    ALLOWED_ORIGINS: list[str] = ["http://localhost:5173"]
    PII_MASKING_ENABLED: bool = True
    RATE_LIMIT_PER_MINUTE: int = 100
    MAX_UPLOAD_SIZE_MB: int = 10

    # --- App ---
    APP_NAME: str = "AI-Помощник ЖКХ"
    APP_VERSION: str = "2.1.0"
    DEBUG: bool = False

    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        "case_sensitive": True,
    }


settings = Settings()
