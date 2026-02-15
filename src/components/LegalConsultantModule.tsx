import { useState } from "react";
import {
  Scale,
  Search,
  BookOpen,
  Gavel,
  AlertCircle,
  CheckCircle2,
  Clock,
  Lightbulb,
  Shield,
  ExternalLink
} from "lucide-react";
import { cn } from "@/utils/cn";
import type { LegalSource, RiskAssessment } from "@/types/types";
import { mockLegalSources, mockRisks, quickQuestions } from "@/mocks/data";

export function LegalConsultantModule() {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [hasResults, setHasResults] = useState(false);
  const [activeTab, setActiveTab] = useState<"sources" | "risks" | "answer">("answer");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState<LegalSource[]>([]);
  const [risks, setRisks] = useState<RiskAssessment[]>([]);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setIsSearching(true);
    setHasResults(false);

    try {
      const { post } = await import("@/api/client");
      const response = await post<{
        answer: string;
        sources: any[];
        risks: any[];
      }>("/api/v1/legal/ask", {
        query: query,
        provider: "deepseek"
      });

      setAnswer(response.answer);
      setSources(response.sources);
      setRisks(response.risks);
      setHasResults(true);
    } catch (error) {
      console.error("Legal search failed:", error);
      alert("Не удалось получить консультацию. Проверьте подключение к бэкенду.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Юридический консультант</h2>
          <p className="text-sm text-slate-500 mt-1">Поиск по ЖК РФ, ПП 354/491 и судебной практике</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">
            DeepSeek AI
          </span>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Задайте юридический вопрос..."
            className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-900 placeholder-slate-400"
          />
          <button
            onClick={handleSearch}
            disabled={isSearching}
            className={cn(
              "absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-lg font-medium transition-all",
              isSearching
                ? "bg-slate-200 text-slate-400"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            )}
          >
            {isSearching ? "Поиск..." : "Найти"}
          </button>
        </div>

        {/* Quick Questions */}
        <div className="mt-4 flex flex-wrap gap-2">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => { setQuery(q); handleSearch(); }}
              className="px-3 py-1.5 bg-slate-100 text-slate-600 text-sm rounded-full hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {hasResults && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Answer */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="flex border-b border-slate-200">
                {[
                  { id: "answer", label: "Ответ", icon: Scale },
                  { id: "sources", label: "Источники", icon: BookOpen },
                  { id: "risks", label: "Риски", icon: AlertCircle },
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id as typeof activeTab)}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors",
                      activeTab === id
                        ? "bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600"
                        : "text-slate-600 hover:bg-slate-50"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {activeTab === "answer" && (
                  <div className="space-y-4">
                    <div className="prose prose-slate max-w-none">
                      <h3 className="text-lg font-semibold text-slate-900 mb-3">
                        Правовое заключение по вопросу взыскания задолженности
                      </h3>
                      <div className="space-y-3 text-slate-700 leading-relaxed">
                        <p className="whitespace-pre-wrap">{answer}</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "sources" && (
                  <div className="space-y-4">
                    {sources.length > 0 ? (
                      sources.map((source) => (
                        <div
                          key={source.id}
                          className="p-5 bg-white rounded-xl border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all group"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className={cn(
                                "w-10 h-10 rounded-lg flex items-center justify-center",
                                source.type === "law" ? "bg-blue-50 text-blue-600" : "bg-violet-50 text-violet-600"
                              )}>
                                {source.type === "law" ? <BookOpen className="w-5 h-5" /> : <Gavel className="w-5 h-5" />}
                              </div>
                              <div>
                                <h4 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                  {source.title}
                                </h4>
                                <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded uppercase">
                                  {source.citation || "Нормативный акт"}
                                </span>
                              </div>
                            </div>
                            <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                              <ExternalLink className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="p-3 bg-slate-50 rounded-lg mb-3">
                            <p className="text-sm text-slate-600 italic leading-relaxed">
                              "{source.content}"
                            </p>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                                <div
                                  className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full"
                                  style={{ width: `${source.relevance * 100}%` }}
                                />
                              </div>
                              <span className="text-xs font-bold text-indigo-600">
                                {(source.relevance * 100).toFixed(0)}% совпадение
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono">ID: {source.id}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                        <Scale className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-500">Источники не найдены</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "risks" && (
                  <div className="space-y-3">
                    {risks.map((risk, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          "p-4 rounded-lg border",
                          risk.level === "high" && "bg-red-50 border-red-200",
                          risk.level === "medium" && "bg-amber-50 border-amber-200",
                          risk.level === "low" && "bg-emerald-50 border-emerald-200",
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                            risk.level === "high" && "bg-red-100 text-red-600",
                            risk.level === "medium" && "bg-amber-100 text-amber-600",
                            risk.level === "low" && "bg-emerald-100 text-emerald-600",
                          )}>
                            {risk.level === "high" ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-slate-900">{risk.category}</span>
                              <span className={cn(
                                "text-xs px-2 py-0.5 rounded-full font-medium",
                                risk.level === "high" && "bg-red-100 text-red-700",
                                risk.level === "medium" && "bg-amber-100 text-amber-700",
                                risk.level === "low" && "bg-emerald-100 text-emerald-700",
                              )}>
                                {risk.level === "high" ? "Высокий" : risk.level === "medium" ? "Средний" : "Низкий"}
                              </span>
                            </div>
                            <p className="text-sm text-slate-600">{risk.description}</p>
                            <p className="text-sm font-medium text-slate-700 mt-2">
                              Рекомендация: {risk.recommendation}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-xl p-4 border border-indigo-200">
              <h3 className="font-medium text-indigo-900 mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Правовая база
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">ЖК РФ</span>
                  <span className="text-indigo-700 font-medium">197 статей</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">ПП №354</span>
                  <span className="text-indigo-700 font-medium">56 пунктов</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">ПП №491</span>
                  <span className="text-indigo-700 font-medium">32 пункта</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Судебная практика</span>
                  <span className="text-indigo-700 font-medium">1,240 дел</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <h3 className="font-medium text-slate-900 mb-3">Последние запросы</h3>
              <div className="space-y-2">
                {[
                  "Расчет пени по долгу",
                  "Сроки подачи претензии",
                  "Ответственность за залив",
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => { setQuery(item); handleSearch(); }}
                    className="w-full text-left text-sm text-slate-600 hover:text-indigo-600 py-2 px-3 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2"
                  >
                    <Clock className="w-4 h-4 text-slate-400" />
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
