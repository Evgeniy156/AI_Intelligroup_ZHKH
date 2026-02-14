import httpx
import re
from typing import Optional
from ..config import settings

class LLMService:
    def __init__(
        self, 
        deepseek_key: Optional[str] = None
    ):
        self.deepseek_key = deepseek_key or settings.DEEPSEEK_API_KEY

    async def generate_response(
        self, 
        prompt: str, 
        provider: str = "deepseek",
        deepseek_key: Optional[str] = None
    ) -> str:
        """
        Универсальный метод генерации ответа. Использует DeepSeek как основной движок.
        """
        # 1. Маскируем данные перед отправкой
        masked_prompt = self._mask_pii(prompt)
        
        # 2. Выбираем ключ
        ds_key = deepseek_key or self.deepseek_key

        if provider == "deepseek":
            return await self._call_deepseek(masked_prompt, ds_key)
        else:
            return f"Ошибка: неизвестный провайдер {provider}. В данной версии поддерживается только DeepSeek."

    def _mask_pii(self, text: str) -> str:
        """
        Простейшее маскирование (заглушка для демонстрации).
        """
        # Маскируем телефоны
        text = re.sub(r'(\+7|8)[\s\-]?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}', '[PHONE_HIDDEN]', text)
        # Маскируем email
        text = re.sub(r'[\w\.-]+@[\w\.-]+\.\w+', '[EMAIL_HIDDEN]', text)
        return text

    async def _call_deepseek(self, prompt: str, key: Optional[str]) -> str:
        if not key:
            return "[DeepSeek] Ошибка: API ключ не задан."
        
        url = f"{settings.DEEPSEEK_API_BASE}/chat/completions"
        headers = {
            "Authorization": f"Bearer {key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": settings.DEEPSEEK_MODEL,
            "messages": [
                {
                    "role": "system", 
                    "content": "Ты — профессиональный ИИ-помощник для управляющих компаний ЖКХ и ТСЖ. Отвечай вежливо, юридически грамотно и по делу."
                },
                {"role": "user", "content": prompt}
            ],
            "stream": False
        }

        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(url, headers=headers, json=payload)
                if response.status_code != 200:
                    return f"[DeepSeek] Ошибка API ({response.status_code}): {response.text}"
                
                result = response.json()
                content = result.get("choices", [{}])[0].get("message", {}).get("content", "")
                if not content:
                    return "[DeepSeek] Ошибка: Пустой ответ от модели."
                return content
        except Exception as e:
            return f"[DeepSeek] Ошибка соединения: {str(e)}"

llm_service = LLMService()
