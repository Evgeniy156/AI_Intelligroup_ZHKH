import { useState, useEffect } from "react";
import {
  MessageSquare,
  Brain,
  Scale,
  FileCheck,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Shield,
  CheckCircle2,
  AlertCircle,
  Clock,
  RefreshCw,
  Server
} from "lucide-react";
import { cn } from "@/utils/cn";
import { dashboardStats, recentActivity, modulesList } from "@/mocks/data";
import { checkHealth } from "@/api/client";

const iconMap: Record<string, React.ElementType> = {
  MessageSquare,
  Brain,
  Scale,
  FileCheck,
};

const colorMap: Record<string, string> = {
  blue: "from-blue-500 to-blue-600",
  indigo: "from-indigo-500 to-indigo-600",
  emerald: "from-emerald-500 to-emerald-600",
};

const moduleIconMap: Record<string, React.ElementType> = {
  requests: MessageSquare,
  legal: Scale,
  supervision: FileCheck,
};

interface DashboardProps {
  onNavigate: (view: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const [backendStatus, setBackendStatus] = useState<"loading" | "online" | "offline">("loading");
  const [backendVersion, setBackendVersion] = useState<string>("");

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const health = await checkHealth();
        if (health.status === "ok") {
          setBackendStatus("online");
          setBackendVersion(health.version);
        } else {
          setBackendStatus("offline");
        }
      } catch (error) {
        setBackendStatus("offline");
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 10000); // Check every 10s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8">
      {/* System Status Row */}
      <div className="flex items-center justify-between bg-white px-4 py-3 rounded-xl border border-slate-200">
        <div className="flex items-center gap-4">
          <div className={cn(
            "p-2 rounded-lg",
            backendStatus === "online" ? "bg-emerald-50" : backendStatus === "offline" ? "bg-red-50" : "bg-slate-50"
          )}>
            <Server className={cn(
              "w-5 h-5",
              backendStatus === "online" ? "text-emerald-600" : backendStatus === "offline" ? "text-red-600" : "text-slate-400"
            )} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-900">Бэкенд Сервис (FastAPI)</span>
              {backendStatus === "loading" && <RefreshCw className="w-3 h-3 animate-spin text-slate-400" />}
            </div>
            <p className="text-xs text-slate-500">
              {backendStatus === "online" ? `В сети • Версия ${backendVersion}` : backendStatus === "offline" ? "Ошибка подключения" : "Проверка связи..."}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className={cn(
            "w-2.5 h-2.5 rounded-full",
            backendStatus === "online" ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : backendStatus === "offline" ? "bg-red-500" : "bg-slate-300"
          )} />
          <span className={cn(
            "text-xs font-bold uppercase tracking-wider",
            backendStatus === "online" ? "text-emerald-700" : backendStatus === "offline" ? "text-red-700" : "text-slate-500"
          )}>
            {backendStatus === "online" ? "Online" : backendStatus === "offline" ? "Offline" : "Checking"}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardStats.map((stat, idx) => {
          const Icon = iconMap[stat.iconName] || Activity;
          return (
            <div key={idx} className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 bg-slate-100 rounded-lg">
                  <Icon className="w-5 h-5 text-slate-600" />
                </div>
                <div className={cn(
                  "flex items-center gap-1 text-sm font-medium",
                  stat.trend === "up" ? "text-emerald-600" : "text-red-500"
                )}>
                  {stat.trend === "up" ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  {stat.change}
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-semibold text-slate-900">Последняя активность</h3>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Все события
            </button>
          </div>
          <div className="divide-y divide-slate-100">
            {recentActivity.map((item) => (
              <div key={item.id} className="p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center",
                    item.type === "request" && "bg-blue-100 text-blue-600",
                    item.type === "legal" && "bg-indigo-100 text-indigo-600",
                    item.type === "supervision" && "bg-emerald-100 text-emerald-600",
                  )}>
                    {item.type === "request" && <MessageSquare className="w-5 h-5" />}
                    {item.type === "legal" && <Scale className="w-5 h-5" />}
                    {item.type === "supervision" && <FileCheck className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900">{item.title}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className={cn(
                        "text-xs px-2 py-0.5 rounded-full font-medium",
                        item.status === "completed" && "bg-emerald-100 text-emerald-700",
                        item.status === "processing" && "bg-blue-100 text-blue-700",
                        item.status === "draft" && "bg-slate-100 text-slate-600",
                      )}>
                        {item.status === "completed" && <CheckCircle2 className="w-3 h-3 inline mr-1" />}
                        {item.status === "processing" && <Clock className="w-3 h-3 inline mr-1" />}
                        {item.status === "completed" ? "Завершено" : item.status === "processing" ? "Обработка" : "Черновик"}
                      </span>
                      <span className={cn(
                        "text-xs px-2 py-0.5 rounded-full font-medium",
                        item.risk === "low" && "bg-emerald-50 text-emerald-600",
                        item.risk === "medium" && "bg-amber-50 text-amber-600",
                        item.risk === "high" && "bg-red-50 text-red-600",
                      )}>
                        {item.risk === "low" ? "Низкий риск" : item.risk === "medium" ? "Средний" : "Высокий"}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Access Sidebar */}
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-6 text-white">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-5 h-5" />
              <span className="font-semibold">ФЗ-152 Compliance</span>
            </div>
            <div className="space-y-2 text-sm text-blue-100">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                PII маскирование активно
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                RLS включен
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-300" />
                2FA: рекомендуется
              </div>
            </div>
          </div>

          {/* Module Cards */}
          {modulesList.map((mod) => {
            const Icon = moduleIconMap[mod.id] || Activity;
            return (
              <div
                key={mod.id}
                onClick={() => onNavigate(mod.id)}
                className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className={cn("p-2 rounded-lg bg-gradient-to-br", colorMap[mod.color] || "from-slate-500 to-slate-600")}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-slate-900 group-hover:text-blue-600 transition-colors">
                      {mod.title}
                    </h4>
                    <p className="text-sm text-slate-500 mt-0.5">{mod.description}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {mod.features.map((f, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
