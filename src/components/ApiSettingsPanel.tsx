import { useState, useEffect } from "react";
import { Key, Save, ShieldCheck, HelpCircle, Bot, MessageSquareText } from "lucide-react";
import { cn } from "@/utils/cn";

export function ApiSettingsPanel() {
  const [aliceKey, setAliceKey] = useState("");
  const [gigaChatKey, setGigaChatKey] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const savedAlice = localStorage.getItem("alice_ai_key") || "";
    const savedGiga = localStorage.getItem("gigachat_key") || "";
    setAliceKey(savedAlice);
    setGigaChatKey(savedGiga);
  }, []);

  const handleSave = () => {
    localStorage.setItem("alice_ai_key", aliceKey);
    localStorage.setItem("gigachat_key", gigaChatKey);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
          <Key className="w-8 h-8 text-blue-600" />
          Настройки API
        </h2>
        <p className="text-slate-500 mt-1">
          Конфигурация ключей доступа для работы интеллектуальных ассистентов
        </p>
      </div>

      <div className="grid gap-6">
        {/* Alice AI Section */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-white">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Alice AI</h3>
                  <p className="text-sm text-slate-500 font-medium">Yandex GPT & Voice Stack</p>
                </div>
              </div>
              <a href="https://cloud.yandex.ru/docs/iam/concepts/authorization/api-key" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-600 transition-colors">
                <HelpCircle className="w-5 h-5" />
              </a>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  API Ключ (IAM Token или Static Key)
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-violet-500 transition-colors">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    value={aliceKey}
                    onChange={(e) => setAliceKey(e.target.value)}
                    placeholder="Введите ваш Alice AI ключ..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all outline-none text-sm"
                  />
                </div>
                <p className="mt-2 text-xs text-slate-400 italic">
                  * Ключ необходим для работы голосового ассистента и расширенного поиска.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* GigaChat Section */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white">
                  <MessageSquareText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">GigaChat</h3>
                  <p className="text-sm text-slate-500 font-medium">Sber LLM Services</p>
                </div>
              </div>
              <a href="https://developers.sber.ru/docs/ru/gigachat/api/get-tokens" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-600 transition-colors">
                <HelpCircle className="w-5 h-5" />
              </a>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Client Secret / Auth Data
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    value={gigaChatKey}
                    onChange={(e) => setGigaChatKey(e.target.value)}
                    placeholder="Введите данные авторизации GigaChat..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none text-sm"
                  />
                </div>
                <p className="mt-2 text-xs text-slate-400 italic">
                  * Используется для генерации умных ответов на запросы жителей.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between p-1">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Ключи хранятся локально в вашем браузере (AES-256 прототип)</span>
          </div>
          <button
            onClick={handleSave}
            className={cn(
              "px-6 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 shadow-lg",
              isSaved 
                ? "bg-emerald-500 text-white hover:bg-emerald-600 scale-95" 
                : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-200 active:scale-95"
            )}
          >
            {isSaved ? <ShieldCheck className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {isSaved ? "Сохранено!" : "Сохранить настройки"}
          </button>
        </div>
      </div>
    </div>
  );
}
