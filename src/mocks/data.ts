import type {
    PIIMapping,
    RAGResult,
    ResponseVariant,
    LegalSource,
    RiskAssessment,
    DocumentRequirement,
    AuditCheck,
    User,
    LLMSettings,
    ActivityItem,
    ModuleInfo,
} from "@/types/types";

// ============================================================
// Модуль «Ответы на обращения»
// ============================================================

export const mockPII: PIIMapping[] = [
    { original: "Иванов Петр Сергеевич", masked: "<PERSON_1>" },
    { original: "+7 (916) 123-45-67", masked: "<PHONE_1>" },
    { original: "ул. Ленина, д. 15, кв. 42", masked: "<ADDRESS_1>" },
];

export const mockRAGResults: RAGResult[] = [
    { id: 1, title: "Шаблон: Жалобы на отопление", similarity: 0.94, source: "База знаний УК" },
    { id: 2, title: "Прецедент №2024-156", similarity: 0.87, source: "История обращений" },
    { id: 3, title: "ПП РФ №354, п. 15", similarity: 0.82, source: "Нормативные документы" },
];

export const mockResponses: ResponseVariant[] = [
    {
        id: "short",
        title: "Краткий вариант",
        content: `Уважаемый <PERSON_1>!

В ответ на Ваше обращение сообщаем, что по адресу <ADDRESS_1> проведена проверка системы отопления. Выявленная неисправность устранена <DATE>.

Текущая температура в помещении соответствует нормативам (ПП РФ №354).

При возникновении дополнительных вопросов обращайтесь по тел. <PHONE_COMPANY>.

С уважением,
УК "ЖилКомфорт"`,
        tone: "нейтральный",
        riskLevel: "low",
    },
    {
        id: "official",
        title: "Официальный вариант",
        content: `Уважаемый <PERSON_1>!

Настоящим сообщаем, что Ваше обращение, поступившее по каналу связи <CHANNEL>, зарегистрировано под № <REQUEST_NUMBER>.

В соответствии с п. 15 Постановления Правительства РФ от 06.05.2011 № 354, управляющая организация обязана поддерживать температуру в жилых помещениях в соответствии с установленными нормативами.

По результату выездной проверки специалистами УК выявлено отклонение от норматива. Мероприятия по устранению проведены в срок, установленный регламентом.

Контрольное измерение температуры выполнено <DATE>. Результат: <TEMPERATURE>°С (норма: 20-22°С).

Оснований для признания претензии обоснованной не имеется.

Исполнитель: <EXECUTOR>
Контактный телефон: <PHONE_COMPANY>`,
        tone: "строгий",
        riskLevel: "medium",
    },
];

export const defaultRequestText = `От: Иванов Петр Сергеевич
Тел: +7 (916) 123-45-67
Адрес: ул. Ленина, д. 15, кв. 42

Здравствуйте! В моей квартире уже третий день холодно. Температура не выше 16 градусов. Приезжали сантехники, сказали что "разберутся", но ничего не изменилось. Требую устранить нарушения и пересчитать плату за отопление!`;

// ============================================================
// Модуль «Юридический консультант»
// ============================================================

export const mockLegalSources: LegalSource[] = [
    {
        id: "1",
        title: "ЖК РФ, Статья 153",
        type: "law",
        citation: "Ст. 153 ЖК РФ",
        relevance: 0.98,
        content: "Плата за жилое помещение и коммунальные услуги вносится ежемесячно до 10-го числа...",
    },
    {
        id: "2",
        title: "ПП РФ №354, Пункт 42",
        type: "law",
        citation: "п. 42 ПП №354",
        relevance: 0.95,
        content: "Исполнитель обязан обеспечить предоставление коммунальных услуг надлежащего качества...",
    },
    {
        id: "3",
        title: "Судебная практика: АС Города Москвы",
        type: "practice",
        citation: "Дело А40-123456/2023",
        relevance: 0.87,
        content: "Управляющая организация освобождена от ответственности при документальном подтверждении...",
    },
];

export const mockRisks: RiskAssessment[] = [
    {
        level: "medium",
        category: "Просрочка платежа",
        description: "Задолженность образовалась менее  3 месяцев назад",
        recommendation: "Направьте претензию с расчетом задолженности по форме",
    },
    {
        level: "low",
        category: "Документальное подтверждение",
        description: "Все работы задокументированы актами выполненных работ",
        recommendation: "Акты готовы к предоставлению в суд при необходимости",
    },
];

export const quickQuestions = [
    "Как рассчитать неустойку за просрочку платежа?",
    "Правомерно ли отключение отопления?",
    "Как оформить акт о заливе квартиры?",
    "Сроки устранения аварийных ситуаций",
];

// ============================================================
// Модуль «Ответы надзору»
// ============================================================

export const mockRequirements: DocumentRequirement[] = [
    {
        id: "1",
        requirement: "Устранить нарушения температурного режима",
        legalBasis: "п. 15 ПП №354",
        status: "complied",
        documents: ["Акт проверки от 15.01.2024", "Акт выполненных работ"],
    },
    {
        id: "2",
        requirement: "Предоставить протокол общего собрания",
        legalBasis: "ст. 46 ЖК РФ",
        status: "partial",
        documents: ["Уведомление о собрании"],
    },
    {
        id: "3",
        requirement: "Возместить ущерб собственнику",
        legalBasis: "ст. 15, 1064 ГК РФ",
        status: "violation",
        documents: [],
    },
];

export const auditChecks: AuditCheck[] = [
    { id: 1, check: "Отсутствие признания вины", status: "passed" },
    { id: 2, check: "Соблюдение процедуры", status: "passed" },
    { id: 3, check: "Правильные ссылки на нормы", status: "warning" },
    { id: 4, check: "Сроки ответа соблюдены", status: "passed" },
];

// ============================================================
// Админ-панель
// ============================================================

export const mockUsers: User[] = [
    { id: "1", name: "Иванов А.П.", email: "ivanov@uk.ru", role: "admin", status: "active", lastActive: "2 мин назад" },
    { id: "2", name: "Петрова М.С.", email: "petrova@uk.ru", role: "employee", status: "active", lastActive: "1 час назад" },
    { id: "3", name: "Сидоров К.В.", email: "sidorov@uk.ru", role: "employee", status: "inactive", lastActive: "3 дня назад" },
];

export const defaultLLMSettings: LLMSettings = {
    provider: "yandex",
    model: "yandexgpt-pro",
    temperature: 0.7,
    maxTokens: 2048,
};

// ============================================================
// Dashboard
// ============================================================

export const dashboardStats = [
    { label: "Обработано обращений", value: "1,247", change: "+12%", trend: "up" as const, iconName: "MessageSquare" },
    { label: "Сгенерировано ответов", value: "892", change: "+8%", trend: "up" as const, iconName: "Brain" },
    { label: "Юридических консультаций", value: "156", change: "+23%", trend: "up" as const, iconName: "Scale" },
    { label: "Ответов надзору", value: "34", change: "-5%", trend: "down" as const, iconName: "FileCheck" },
];

export const recentActivity: ActivityItem[] = [
    { id: 1, type: "request", title: "Жалоба на отопление", status: "completed", time: "5 мин назад", risk: "low" },
    { id: 2, type: "legal", title: "Консультация: задолженность", status: "processing", time: "12 мин назад", risk: "medium" },
    { id: 3, type: "supervision", title: "Ответ ГЖИ №45-2024", status: "draft", time: "1 час назад", risk: "high" },
    { id: 4, type: "request", title: "Протечка крыши", status: "completed", time: "2 часа назад", risk: "low" },
];

export const modulesList: ModuleInfo[] = [
    {
        id: "requests",
        title: "Ответы на обращения",
        description: "Автоматическая генерация ответов с PII-маскированием и RAG-поиском",
        color: "blue",
        features: ["PII Маскирование", "RAG Поиск", "2 варианта ответа"],
    },
    {
        id: "legal",
        title: "Юридический консультант",
        description: "Поиск по ЖК РФ, ПП 354/491 и внутренней базе знаний",
        color: "indigo",
        features: ["ЖК РФ", "Судебная практика", "Риски"],
    },
    {
        id: "supervision",
        title: "Ответы надзору",
        description: "Формирование юридически выверенных ответов для ГЖИ и прокуратуры",
        color: "emerald",
        features: ["ГЖИ", "Прокуратура", "Аудит"],
    },
];
