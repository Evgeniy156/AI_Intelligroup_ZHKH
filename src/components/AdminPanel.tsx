import { useState } from "react";
import {
  Settings,
  Users,
  Cpu,
  Shield,
  Database,
  Plus,
  Trash2,
  Edit,
  Key,
  Globe,
  Bell,
  Save,
  CheckCircle2,
  AlertCircle,
  Activity
} from "lucide-react";
import { cn } from "@/utils/cn";
import type { User } from "@/types/types";
import { mockUsers, defaultLLMSettings } from "@/mocks/data";

const tabs = [
  { id: "general", label: "Общие", icon: Settings },
  { id: "users", label: "Пользователи", icon: Users },
  { id: "llm", label: "LLM Настройки", icon: Cpu },
  { id: "security", label: "Безопасность", icon: Shield },
  { id: "system", label: "Система", icon: Database },
];

export function AdminPanel() {
  const [activeTab, setActiveTab] = useState("general");
  const [users] = useState<User[]>(mockUsers);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Администрирование</h2>
        <p className="text-sm text-slate-500 mt-1">Управление пользователями, настройками и безопасностью</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-56 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  activeTab === tab.id
                    ? "bg-blue-600 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                )}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-xl border border-slate-200 p-6">
          {activeTab === "general" && (
            <div className="space-y-6">
              <h3 className="font-semibold text-slate-900">Настройки организации</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Название УК/ТСЖ</label>
                  <input
                    type="text"
                    defaultValue='ООО "УК ЖилКомфорт"'
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">ИНН</label>
                  <input
                    type="text"
                    defaultValue="7712345678"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Адрес</label>
                  <input
                    type="text"
                    defaultValue="г. Москва, ул. Пушкина, д. 1"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Телефон</label>
                  <input
                    type="text"
                    defaultValue="+7 (495) 123-45-67"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    defaultValue="info@zhilkomfort.ru"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="border-t border-slate-200 pt-6">
                <h3 className="font-semibold text-slate-900 mb-4">Дополнительные настройки</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium text-slate-900">Авто-подпись</p>
                      <p className="text-sm text-slate-500">Автоматическая подпись к генерируемым ответам</p>
                    </div>
                    <label className="relative cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
                    </label>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium text-slate-900">Email-уведомления</p>
                      <p className="text-sm text-slate-500">Отправлять уведомления о новых обращениях</p>
                    </div>
                    <label className="relative cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
                    </label>
                  </div>
                </div>
              </div>

              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
                <Save className="w-4 h-4" />
                Сохранить
              </button>
            </div>
          )}

          {activeTab === "users" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-900">Пользователи</h3>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Добавить
                </button>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left text-sm font-medium text-slate-500 pb-3">Имя</th>
                    <th className="text-left text-sm font-medium text-slate-500 pb-3">Email</th>
                    <th className="text-left text-sm font-medium text-slate-500 pb-3">Роль</th>
                    <th className="text-left text-sm font-medium text-slate-500 pb-3">Статус</th>
                    <th className="text-left text-sm font-medium text-slate-500 pb-3">Активность</th>
                    <th className="text-right text-sm font-medium text-slate-500 pb-3">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-slate-100">
                      <td className="py-3 text-sm font-medium text-slate-900">{user.name}</td>
                      <td className="py-3 text-sm text-slate-600">{user.email}</td>
                      <td className="py-3">
                        <span className={cn(
                          "px-2 py-1 text-xs font-medium rounded-full",
                          user.role === "admin" && "bg-purple-100 text-purple-700",
                          user.role === "employee" && "bg-blue-100 text-blue-700",
                          user.role === "viewer" && "bg-slate-100 text-slate-600",
                        )}>
                          {user.role === "admin" ? "Администратор" : user.role === "employee" ? "Сотрудник" : "Наблюдатель"}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className={cn(
                          "px-2 py-1 text-xs font-medium rounded-full",
                          user.status === "active" && "bg-emerald-100 text-emerald-700",
                          user.status === "inactive" && "bg-slate-100 text-slate-600",
                        )}>
                          {user.status === "active" ? "Активен" : "Неактивен"}
                        </span>
                      </td>
                      <td className="py-3 text-sm text-slate-500">{user.lastActive}</td>
                      <td className="py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 text-slate-400 hover:text-red-600 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "llm" && (
            <div className="space-y-6">
              <h3 className="font-semibold text-slate-900">Настройки LLM</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Провайдер</label>
                  <select
                    defaultValue={defaultLLMSettings.provider}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="yandex">YandexGPT</option>
                    <option value="sber">GigaChat</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Модель</label>
                  <select
                    defaultValue={defaultLLMSettings.model}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="yandexgpt-pro">YandexGPT Pro</option>
                    <option value="yandexgpt-lite">YandexGPT Lite</option>
                    <option value="gigachat-pro">GigaChat Pro</option>
                    <option value="gigachat-max">GigaChat Max</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Temperature: {defaultLLMSettings.temperature}
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.1}
                    defaultValue={defaultLLMSettings.temperature}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Max Tokens</label>
                  <input
                    type="number"
                    defaultValue={defaultLLMSettings.maxTokens}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="border-t border-slate-200 pt-6">
                <h4 className="font-medium text-slate-900 mb-4 flex items-center gap-2">
                  <Key className="w-4 h-4 text-slate-500" />
                  API Ключи
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="font-medium text-slate-900">YandexGPT API Key</p>
                        <p className="text-xs text-slate-500 font-mono">AQVN*****...****KxPQ</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                      Активен
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-violet-500" />
                      <div>
                        <p className="font-medium text-slate-900">GigaChat API Key</p>
                        <p className="text-xs text-slate-500 font-mono">Не настроен</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                      Не активен
                    </span>
                  </div>
                </div>
              </div>

              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
                <Save className="w-4 h-4" />
                Сохранить настройки
              </button>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-6">
              <h3 className="font-semibold text-slate-900">Безопасность и ФЗ-152</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-emerald-600" />
                    <div>
                      <p className="font-medium text-slate-900">PII Маскирование</p>
                      <p className="text-sm text-slate-500">Автоматическое маскирование ФИО, телефонов, адресов</p>
                    </div>
                  </div>
                  <label className="relative cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600" />
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Database className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-slate-900">Row-Level Security</p>
                      <p className="text-sm text-slate-500">Изоляция данных между организациями</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                    Активно
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Key className="w-5 h-5 text-violet-600" />
                    <div>
                      <p className="font-medium text-slate-900">Двухфакторная аутентификация</p>
                      <p className="text-sm text-slate-500">TOTP для администраторов</p>
                    </div>
                  </div>
                  <label className="relative cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:ring-4 peer-focus:ring-violet-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600" />
                  </label>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-6">
                <h4 className="font-medium text-slate-900 mb-4">Аудит-лог</h4>
                <div className="space-y-2">
                  {[
                    { action: "Генерация ответа", user: "Иванов А.П.", time: "5 мин назад", icon: CheckCircle2, color: "emerald" },
                    { action: "Изменение настроек LLM", user: "Иванов А.П.", time: "1 час назад", icon: AlertCircle, color: "amber" },
                    { action: "Добавление пользователя", user: "Иванов А.П.", time: "2 часа назад", icon: Plus, color: "blue" },
                  ].map((entry, idx) => {
                    const Icon = entry.icon;
                    return (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <Icon className={cn(
                          "w-4 h-4",
                          entry.color === "emerald" && "text-emerald-600",
                          entry.color === "amber" && "text-amber-600",
                          entry.color === "blue" && "text-blue-600",
                        )} />
                        <span className="text-sm text-slate-900 flex-1">{entry.action}</span>
                        <span className="text-sm text-slate-500">{entry.user}</span>
                        <span className="text-xs text-slate-400">{entry.time}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === "system" && (
            <div className="space-y-6">
              <h3 className="font-semibold text-slate-900">Состояние системы</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "PostgreSQL", status: "online", version: "16.1", icon: Database },
                  { label: "Redis", status: "online", version: "7.2", icon: Activity },
                  { label: "YandexGPT API", status: "online", version: "v1", icon: Cpu },
                  { label: "Nginx", status: "online", version: "1.25", icon: Globe },
                ].map((service, idx) => {
                  const Icon = service.icon;
                  return (
                    <div key={idx} className="p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <Icon className="w-5 h-5 text-slate-500" />
                        <span className="font-medium text-slate-900">{service.label}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">v{service.version}</span>
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span className="text-xs text-emerald-700 font-medium">Online</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-slate-200 pt-6">
                <h4 className="font-medium text-slate-900 mb-4 flex items-center gap-2">
                  <Bell className="w-4 h-4 text-slate-500" />
                  Последние события
                </h4>
                <div className="space-y-2">
                  {[
                    { text: "Backup completed successfully", time: "04:00", status: "success" },
                    { text: "Database migration applied", time: "Yesterday", status: "info" },
                    { text: "SSL certificate renewed", time: "3 days ago", status: "success" },
                  ].map((event, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        event.status === "success" && "bg-emerald-500",
                        event.status === "info" && "bg-blue-500",
                      )} />
                      <span className="text-sm text-slate-700 flex-1">{event.text}</span>
                      <span className="text-xs text-slate-400">{event.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
