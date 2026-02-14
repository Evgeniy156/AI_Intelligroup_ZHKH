import {
    Server,
    Database,
    Cpu,
    Shield,
    Globe,
    Layers,
    ArrowRight,
    CheckCircle2,
    Lock,
    FileText,
    Brain,
    HardDrive
} from "lucide-react";
import { cn } from "@/utils/cn";

interface ComponentProps {
    title: string;
    subtitle: string;
    icon: React.ElementType;
    color: string;
    features?: string[];
    status?: "active" | "warning" | "inactive";
}

function ArchitectureCard({ title, subtitle, icon: Icon, color, features, status = "active" }: ComponentProps) {
    const colors: Record<string, string> = {
        blue: "from-blue-500 to-blue-600",
        indigo: "from-indigo-500 to-indigo-600",
        emerald: "from-emerald-500 to-emerald-600",
        violet: "from-violet-500 to-violet-600",
        amber: "from-amber-500 to-amber-600",
        rose: "from-rose-500 to-rose-600",
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-lg transition-all duration-300">
            <div className="flex items-start gap-3">
                <div className={cn("p-2.5 rounded-lg bg-gradient-to-br", colors[color])}>
                    <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-slate-900">{title}</h3>
                        {status === "active" && <div className="w-2 h-2 rounded-full bg-emerald-500" />}
                    </div>
                    <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>
                </div>
            </div>
            {features && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                    {features.map((feature, idx) => (
                        <span key={idx} className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
                            {feature}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}

const techStack = [
    { name: "React 18", category: "Frontend", icon: Globe },
    { name: "TypeScript", category: "Frontend", icon: FileText },
    { name: "Tailwind CSS", category: "Frontend", icon: Layers },
    { name: "FastAPI", category: "Backend", icon: Server },
    { name: "Python 3.11", category: "Backend", icon: Cpu },
    { name: "PostgreSQL 16", category: "Database", icon: Database },
    { name: "Redis", category: "Cache", icon: HardDrive },
    { name: "pgvector", category: "Database", icon: Database },
    { name: "DeepSeek AI", category: "AI", icon: Brain },
    { name: "LangChain", category: "AI", icon: Layers },
];

const securityFeatures = [
    { title: "PII Маскирование", desc: "ФИО и телефоны заменяются токенами перед отправкой в LLM", icon: Shield },
    { title: "Row-Level Security", desc: "Изоляция данных между организациями на уровне БД", icon: Lock },
    { title: "TLS 1.3", desc: "Шифрование данных при передаче", icon: Lock },
    { title: "Шифрование дисков", desc: "AES-256 для данных в покое", icon: Database },
];

export function ArchitectureView() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-slate-900">Архитектура системы</h2>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="space-y-4">
                        <div className="text-center mb-4">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Клиентская часть</span>
                        </div>
                        <ArchitectureCard
                            title="Frontend App"
                            subtitle="React + TypeScript"
                            icon={Globe}
                            color="blue"
                            features={["SPA", "Tailwind CSS", "REST API"]}
                        />
                    </div>

                    <div className="space-y-4">
                        <div className="text-center mb-4">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">API Слой</span>
                        </div>
                        <ArchitectureCard
                            title="Nginx Proxy"
                            subtitle="Reverse Proxy"
                            icon={Server}
                            color="indigo"
                            features={["Load Balancing", "SSL Termination"]}
                        />
                        <ArchitectureCard
                            title="FastAPI Backend"
                            subtitle="Python 3.11+"
                            icon={Cpu}
                            color="indigo"
                            features={["Async/Await", "JWT Auth", "RBAC"]}
                        />
                    </div>

                    <div className="space-y-4">
                        <div className="text-center mb-4">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">AI Core</span>
                        </div>
                        <ArchitectureCard
                            title="AI Orchestrator"
                            subtitle="LangChain / LangGraph"
                            icon={Brain}
                            color="violet"
                            features={["Prompt Chains", "Context Mgmt"]}
                        />
                        <ArchitectureCard
                            title="RAG Engine"
                            subtitle="Vector Search"
                            icon={Database}
                            color="violet"
                            features={["pgvector", "Embeddings", "Similarity"]}
                        />
                        <ArchitectureCard
                            title="PII Masking"
                            subtitle="Data Sanitizer"
                            icon={Shield}
                            color="amber"
                            features={["NER", "Tokenization", "ФЗ-152"]}
                        />
                    </div>

                    <div className="space-y-4">
                        <div className="text-center mb-4">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Внешние API</span>
                        </div>
                        <ArchitectureCard
                            title="DeepSeek AI API"
                            subtitle="Primary SaaS LLM Provider"
                            icon={Brain}
                            color="rose"
                            features={["OpenAI Compat", "Fast Inference"]}
                        />
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-slate-200">
                    <div className="text-center mb-4">
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Хранение данных</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <ArchitectureCard
                            title="PostgreSQL 16"
                            subtitle="Relational + Vector"
                            icon={Database}
                            color="emerald"
                            features={["pgvector ext", "RLS", "Мulti-tenant"]}
                        />
                        <ArchitectureCard
                            title="Redis"
                            subtitle="Cache + Broker"
                            icon={HardDrive}
                            color="emerald"
                            features={["Cache", "Celery Queue", "Sessions"]}
                        />
                        <ArchitectureCard
                            title="S3 Storage"
                            subtitle="Document Storage"
                            icon={FileText}
                            color="emerald"
                            features={["Documents", "Backups", "Encrypted"]}
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-blue-600" />
                    Архитектурные принципы
                </h3>
                <div className="space-y-3">
                    {[
                        { title: "SaaS Multi-tenant", desc: "Единая инсталляция для множества УК/ТСЖ" },
                        { title: "API First", desc: "REST API между фронтендом и бэкендом" },
                        { title: "Asynchronous AI", desc: "Неблокирующая генерация ответов через очередь" },
                        { title: "Scalable Infrastructure", desc: "Гибкая архитектура для высоких нагрузок" },
                    ].map((item, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-medium text-slate-900">{item.title}</p>
                                <p className="text-sm text-slate-500">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
