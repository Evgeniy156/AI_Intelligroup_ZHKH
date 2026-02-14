import httpx
from typing import Optional
from app.config import settings

class LLMService:
    def __init__(
        self, 
        yandex_key: Optional[str] = None, 
        gigachat_key: Optional[str] = None
    ):
        self.yandex_key = yandex_key or settings.YANDEX_API_KEY
        self.gigachat_key = gigachat_key or settings.GIGACHAT_API_KEY

    async def generate_response(
        self, 
        prompt: str, 
        provider: str = "yandex",
        yandex_key: Optional[str] = None,
        gigachat_key: Optional[str] = None
    ) -> str:
        """
        Универсальный метод генерации ответа.
        """
        # 1. Маскируем данные перед отправкой (простейшая версия)
        masked_prompt = self._mask_pii(prompt)
        
        # 2. Выбираем ключи (переданные имеют приоритет над системными)
        y_key = yandex_key or self.yandex_key
        g_key = gigachat_key or self.gigachat_key

        if provider == "yandex":
            return await self._call_yandex(masked_prompt, y_key)
        elif provider == "gigachat":
            return await self._call_gigachat(masked_prompt, g_key)
        else:
            return f"Ошибка: неизвестный провайдер {provider}"

    def _mask_pii(self, text: str) -> str:
        """
        Простейшее маскирование (заглушка для демонстрации).
        В будущем здесь будет NER модель или расширенные регулярки.
        """
        import re
        # Маскируем телефоны
        text = re.sub(r'(\+7|8)[\s\-]?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}', '[PHONE_HIDDEN]', text)
        # Маскируем email
        text = re.sub(r'[\w\.-]+@[\w\.-]+\.\w+', '[EMAIL_HIDDEN]', text)
        return text

    async def _call_yandex(self, prompt: str, key: Optional[str]) -> str:
        if not key:
            return "[YandexGPT] Ошибка: API ключ не задан."
        
        # В прототипе имитируем задержку сети
        import asyncio
        await asyncio.sleep(1)
        
        return f"[YandexGPT] Сгенерированный ответ на запрос: {prompt[:100]}... (Ключ успешно использован)"

    async def _call_gigachat(self, prompt: str, key: Optional[str]) -> str:
        if not key:
            return "[GigaChat] Ошибка: API ключ не задан."
        
        import asyncio
        await asyncio.sleep(1)
        
        return f"[GigaChat] Сгенерированный ответ на запрос: {prompt[:100]}... (Ключ успешно использован)"

llm_service = LLMService()
