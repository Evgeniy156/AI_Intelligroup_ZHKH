import { Menu, Bell, Shield, User } from "lucide-react";

interface HeaderProps {
  onMenuToggle: () => void;
  currentView: string;
}

const viewTitles: Record<string, string> = {
  dashboard: "Панель управления",
  requests: "Ответы на обращения",
  legal: "Юридический консультант",
  supervision: "Ответы надзору",
  admin: "Администрирование",
  architecture: "Архитектура системы",
  api: "API Настройки",
};

export function Header({ onMenuToggle, currentView }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 h-16 bg-white border-b border-slate-200 shadow-sm">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <Menu className="w-5 h-5 text-slate-600" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-slate-900">AI-Помощник ЖКХ</h1>
              <p className="text-xs text-slate-500 hidden sm:block">SaaS платформа для УК и ТСЖ</p>
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center">
          <span className="text-sm text-slate-600 font-medium">
            {viewTitles[currentView] || "Панель управления"}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-full border border-emerald-200">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-emerald-700">Система активна</span>
          </div>

          <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors relative">
            <Bell className="w-5 h-5 text-slate-600" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-sm font-medium text-slate-900">Иванов А.П.</p>
              <p className="text-xs text-slate-500">Администратор УК</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
