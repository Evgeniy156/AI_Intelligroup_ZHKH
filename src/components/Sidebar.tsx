import {
  LayoutDashboard,
  MessageSquare,
  Scale,
  FileCheck,
  Settings,
  Network,
  ChevronRight,
  Building2,
  Key
} from "lucide-react";
import { cn } from "@/utils/cn";

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  isOpen: boolean;
}

const menuItems = [
  { id: "dashboard", label: "Панель управления", icon: LayoutDashboard },
  { id: "requests", label: "Ответы на обращения", icon: MessageSquare },
  { id: "legal", label: "Юридический консультант", icon: Scale },
  { id: "supervision", label: "Ответы надзору", icon: FileCheck },
  // { id: "architecture", label: "Архитектура", icon: Network },
  { id: "api", label: "API Настройки", icon: Key },
  { id: "admin", label: "Администрирование", icon: Settings },
];

export function Sidebar({ currentView, onNavigate, isOpen }: SidebarProps) {
  return (
    <aside
      className={cn(
        "fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r border-slate-200 transition-all duration-300 z-40",
        isOpen ? "w-64" : "w-0 overflow-hidden"
      )}
    >
      <div className="p-4">
        <div className="mb-6 p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">УК "ЖилКомфорт"</p>
              <p className="text-xs text-slate-500">Организация №12345</p>
            </div>
          </div>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive ? "text-white" : "text-slate-500")} />
                <span className="truncate">{item.label}</span>
                {isActive && (
                  <ChevronRight className="w-4 h-4 ml-auto" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200">
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>ФЗ-152: Данные защищены</span>
        </div>
        <div className="mt-2 text-xs text-slate-400">
          v2.1.0 • PostgreSQL 16 • YandexGPT
        </div>
      </div>
    </aside>
  );
}
