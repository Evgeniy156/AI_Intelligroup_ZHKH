import { useState } from "react";
import {
  Shield,
  Brain,
  CheckCircle2,
  Copy,
  RefreshCw,
  FileText,
  MessageSquare,
  Sparkles
} from "lucide-react";
import { cn } from "@/utils/cn";
import type { ResponseVariant } from "@/types/types";
import { mockPII, mockRAGResults, mockResponses, defaultRequestText } from "@/mocks/data";

export function RequestResponseModule() {
  const [inputText, setInputText] = useState(defaultRequestText);
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<number>(0);
  const [showMasked, setShowMasked] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<string>("short");
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setIsProcessing(true);
    setStep(1);

    try {
      // Имитация шагов для UI
      setTimeout(() => setStep(2), 600);
      setTimeout(() => setStep(3), 1200);

      const deepseek_api_key = localStorage.getItem("deepseek_key");

      const { post } = await import("@/api/client");

      setStep(4);
      const response = await post<{ content: string; provider: string }>("/api/v1/llm/generate", {
        prompt: inputText,
        provider: "deepseek",
        deepseek_key: deepseek_api_key,
      });

      setStep(5);
      // Обновляем моковые ответы реальным результатом для демонстрации
      // В реальном приложении мы бы вывели полученный контент в спец. поле
      console.log("LLM Response:", response.content);
    } catch (error) {
      console.error("Generation failed:", error);
      alert("Не удалось сгенерировать ответ. Проверьте подключение к бэкенду и API ключи.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getMaskedText = () => {
    let text = inputText;
    mockPII.forEach(({ original, masked }) => {
      text = text.replace(original, masked);
    });
    return text;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Ответы на обращения граждан</h2>
          <p className="text-sm text-slate-500 mt-1">Автоматическая генерация с PII-маскированием и RAG-поиском</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
            DeepSeek AI
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-slate-900">Входящее обращение</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowMasked(!showMasked)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-lg transition-colors",
                    showMasked
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-100 text-slate-600"
                  )}
                >
                  {showMasked ? "PII замаскировано" : "Показать исходный"}
                </button>
              </div>
            </div>
            <div className="p-4">
              <textarea
                value={showMasked ? getMaskedText() : inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full h-64 p-4 bg-slate-50 rounded-lg border border-slate-200 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                placeholder="Вставьте текст обращения..."
              />
            </div>
          </div>

          {/* PII Masking Info */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-200">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-5 h-5 text-emerald-600" />
              <span className="font-medium text-emerald-900">PII Маскирование (ФЗ-152)</span>
            </div>
            <div className="space-y-2">
              {mockPII.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">{item.original}</span>
                  <span className="text-slate-400">→</span>
                  <span className="font-mono text-emerald-700 bg-white px-2 py-0.5 rounded">{item.masked}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isProcessing}
            className={cn(
              "w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all",
              isProcessing
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-blue-200"
            )}
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Обработка...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Сгенерировать ответ
              </>
            )}
          </button>
        </div>

        {/* Processing & Output Section */}
        <div className="space-y-4">
          {/* Processing Steps */}
          {(isProcessing || step > 0) && (
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <h3 className="font-medium text-slate-900 mb-4">Процесс обработки</h3>
              <div className="space-y-3">
                {[
                  { id: 1, label: "Маскирование ПДн", icon: Shield },
                  { id: 2, label: "Классификация темы", icon: Brain },
                  { id: 3, label: "RAG поиск контекста", icon: FileText },
                  { id: 4, label: "Генерация ответа", icon: Sparkles },
                  { id: 5, label: "Валидация рисков", icon: CheckCircle2 },
                ].map(({ id, label, icon: Icon }) => (
                  <div
                    key={id}
                    className={cn(
                      "flex items-center gap-3 p-2 rounded-lg transition-all",
                      step >= id ? "bg-blue-50" : "bg-slate-50",
                      step === id && isProcessing && "animate-pulse"
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center",
                      step > id ? "bg-emerald-100 text-emerald-600" :
                        step === id ? "bg-blue-100 text-blue-600" :
                          "bg-slate-200 text-slate-400"
                    )}>
                      {step > id ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                    </div>
                    <span className={cn(
                      "text-sm",
                      step >= id ? "text-slate-900" : "text-slate-400"
                    )}>
                      {label}
                    </span>
                    {step === id && isProcessing && (
                      <RefreshCw className="w-4 h-4 text-blue-600 animate-spin ml-auto" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* RAG Results */}
          {step >= 3 && (
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <h3 className="font-medium text-slate-900 mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                Найденный контекст (RAG)
              </h3>
              <div className="space-y-2">
                {mockRAGResults.map((result) => (
                  <div key={result.id} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{result.title}</p>
                      <p className="text-xs text-slate-500">{result.source}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${result.similarity * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-500">{(result.similarity * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Generated Responses */}
          {step >= 5 && (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="p-4 border-b border-slate-200">
                <h3 className="font-medium text-slate-900">Сгенерированные варианты</h3>
              </div>
              <div className="p-4">
                <div className="flex gap-2 mb-4">
                  {mockResponses.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant.id)}
                      className={cn(
                        "px-3 py-1.5 text-sm font-medium rounded-lg transition-colors",
                        selectedVariant === variant.id
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      )}
                    >
                      {variant.title}
                    </button>
                  ))}
                </div>

                {mockResponses.map((variant) => (
                  selectedVariant === variant.id && (
                    <div key={variant.id} className="space-y-3">
                      <div className="flex items-center gap-3">
                        <span className={cn(
                          "px-2 py-1 text-xs font-medium rounded-full",
                          variant.riskLevel === "low" && "bg-emerald-100 text-emerald-700",
                          variant.riskLevel === "medium" && "bg-amber-100 text-amber-700",
                          variant.riskLevel === "high" && "bg-red-100 text-red-700",
                        )}>
                          Риск: {variant.riskLevel === "low" ? "низкий" : variant.riskLevel === "medium" ? "средний" : "высокий"}
                        </span>
                        <span className="text-xs text-slate-500">Тон: {variant.tone}</span>
                      </div>
                      <div className="relative">
                        <textarea
                          readOnly
                          value={variant.content}
                          className="w-full h-48 p-4 bg-slate-50 rounded-lg border border-slate-200 resize-none font-mono text-sm"
                        />
                        <button
                          onClick={() => handleCopy(variant.content)}
                          className="absolute top-2 right-2 p-2 bg-white rounded-lg shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors"
                        >
                          {copied ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Copy className="w-4 h-4 text-slate-500" />
                          )}
                        </button>
                      </div>
                    </div>
                  )
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
