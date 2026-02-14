# AI-Помощник ЖКХ: Архитектура системы

## C4 Container Diagram

### Клиентская часть (Frontend App)
*   **Технологии**: React + TypeScript
*   **Особенности**: 
    *   SPA
    *   Tailwind CSS
    *   REST API

### API Слой
*   **Nginx Proxy**: Reverse Proxy, Load Balancing, SSL Termination
*   **FastAPI Backend**: Python 3.11+, Async/Await, JWT Auth, RBAC

### AI Core
*   **AI Orchestrator**: LangChain / LangGraph, Prompt Chains, Context Mgmt
*   **RAG Engine**: Vector Search, pgvector, Embeddings, Similarity
*   **PII Masking**: Data Sanitizer, NER, Tokenization, ФЗ-152

### Внешние API
*   **YandexGPT API**: SaaS LLM Provider (Pro/Lite), RF Compliant
*   **GigaChat API**: Sber Devices, Alternative, RF Compliant

### Хранение данных
*   **PostgreSQL 16**: Relational + Vector (pgvector), RLS, Мulti-tenant
*   **Redis**: Cache + Broker, Cache, Celery Queue, Sessions
*   **S3 Storage**: Document Storage, Documents, Backups, Encrypted

## Технологический стек
*   React 18
*   TypeScript
*   Tailwind CSS
*   FastAPI
*   Python 3.11
*   PostgreSQL 16
*   Redis
*   pgvector
*   YandexGPT
*   LangChain

## Безопасность и ФЗ-152
*   **PII Маскирование**: ФИО и телефоны заменяются токенами перед отправкой в LLM
*   **Row-Level Security**: Изоляция данных между организациями на уровне БД
*   **TLS 1.3**: Шифрование данных при передаче
*   **Шифрование дисков**: AES-256 для данных в покое

## Архитектурные принципы
*   **SaaS Multi-tenant**: Единая инсталляция для множества УК/ТСЖ
*   **API First**: REST API между фронтендом и бэкендом
*   **Asynchronous AI**: Неблокирующая генерация ответов через очередь
*   **Scalable Architecture**: Простота развертывания с возможностью масштабирования

## Поток обработки запроса
1. Обращение
2. PII Маскирование
3. RAG Поиск
4. LLM Генерация
5. Валидация
6. Демаскирование
