import { useState, useRef } from "react";
import {
  FileCheck,
  Upload,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Building2,
  Calendar,
  Hash,
  AlertCircle,
  Copy,
  Download,
  Shield,
  Clock
} from "lucide-react";
import { cn } from "@/utils/cn";
import type { DocumentRequirement, AuditCheck } from "@/types/types";
import { analyzeDocument, generateSupervisionResponse } from "@/api/supervision";

export function SupervisionResponseModule() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [analysisId, setAnalysisId] = useState<string | null>(null);
  const [requirements, setRequirements] = useState<DocumentRequirement[]>([]);
  const [auditChecks, setAuditChecks] = useState<AuditCheck[]>([]);
  const [documentInfo, setDocumentInfo] = useState<{ sender: string; number: string; date: string; deadline: string } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResponse, setGeneratedResponse] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    setError(null);
    setUploadedFile(file.name);
    setIsAnalyzing(true);
    setAnalysisComplete(false);
    setGeneratedResponse("");
    try {
      const result = await analyzeDocument(file);
      setAnalysisId(result.id);
      setRequirements(result.requirements);
      setAuditChecks(result.auditChecks);
      setDocumentInfo(result.documentInfo);
      setAnalysisComplete(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Не удалось проанализировать документ.";
      setError(message);
      setUploadedFile(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateResponse = async () => {
    if (!analysisId) return;
    setError(null);
    setIsGenerating(true);
    try {
      const { response } = await generateSupervisionResponse(analysisId);
      setGeneratedResponse(response);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Не удалось сгенерировать ответ.";
      setError(message);
      alert(message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setUploadedFile(null);
    setAnalysisId(null);
    setRequirements([]);
    setAuditChecks([]);
    setDocumentInfo(null);
    setAnalysisComplete(false);
    setGeneratedResponse("");
    setError(null);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedResponse);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Генератор ответов надзору</h2>
          <p className="text-sm text-slate-500 mt-1">Формирование юридически выверенных ответов для ГЖИ и прокуратуры</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
            Audit Mode
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          {/* Document Upload */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-medium text-slate-900 mb-4 flex items-center gap-2">
              <Upload className="w-5 h-5 text-emerald-600" />
              Загрузка документа
            </h3>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.txt"
              className="hidden"
              onChange={handleFileSelect}
            />
            {!uploadedFile ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-emerald-400 hover:bg-emerald-50/50 transition-all cursor-pointer"
              >
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-emerald-600" />
                </div>
                <p className="font-medium text-slate-900 mb-1">Загрузите предписание или запрос</p>
                <p className="text-sm text-slate-500">PDF, DOCX, TXT до 10 МБ</p>
              </div>
            ) : (
              <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg">
                    <FileText className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">{uploadedFile}</p>
                    <p className="text-sm text-slate-500">Загружено</p>
                  </div>
                  <button
                    onClick={handleReset}
                    className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                    title="Удалить и загрузить другой"
                  >
                    <AlertCircle className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
          </div>

          {/* Document Info */}
          {uploadedFile && documentInfo && (
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="font-medium text-slate-900 mb-4">Информация о документе</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-sm text-slate-500">Отправитель</p>
                    <p className="font-medium text-slate-900">{documentInfo.sender}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Hash className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-sm text-slate-500">Номер</p>
                    <p className="font-medium text-slate-900">{documentInfo.number}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-sm text-slate-500">Дата</p>
                    <p className="font-medium text-slate-900">{documentInfo.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-sm text-slate-500">Срок ответа</p>
                    <p className="font-medium text-amber-700">{documentInfo.deadline}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Generate Button */}
          {analysisComplete && !generatedResponse && (
            <button
              onClick={handleGenerateResponse}
              disabled={isGenerating}
              className={cn(
                "w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-emerald-200 transition-all flex items-center justify-center gap-2",
                isGenerating && "opacity-70 cursor-not-allowed"
              )}
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Генерация...
                </>
              ) : (
                <>
                  <FileCheck className="w-5 h-5" />
                  Сгенерировать ответ
                </>
              )}
            </button>
          )}
        </div>

        {/* Analysis & Output Section */}
        <div className="space-y-4">
          {/* Analysis Results */}
          {isAnalyzing && (
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                <span className="font-medium text-slate-900">Анализ документа...</span>
              </div>
              <div className="space-y-2">
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full animate-pulse w-3/4" />
                </div>
                <p className="text-sm text-slate-500">Извлечение требований и правовых оснований</p>
              </div>
            </div>
          )}

          {analysisComplete && (
            <>
              {/* Requirements List */}
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="font-medium text-slate-900 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  Выявленные требования
                </h3>
                <div className="space-y-3">
                  {requirements.map((req) => (
                    <div
                      key={req.id}
                      className={cn(
                        "p-4 rounded-lg border",
                        req.status === "complied" && "bg-emerald-50 border-emerald-200",
                        req.status === "partial" && "bg-amber-50 border-amber-200",
                        req.status === "violation" && "bg-red-50 border-red-200",
                      )}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <p className="font-medium text-slate-900">{req.requirement}</p>
                        <span className={cn(
                          "text-xs px-2 py-1 rounded-full font-medium",
                          req.status === "complied" && "bg-emerald-100 text-emerald-700",
                          req.status === "partial" && "bg-amber-100 text-amber-700",
                          req.status === "violation" && "bg-red-100 text-red-700",
                        )}>
                          {req.status === "complied" ? "Исполнено" : req.status === "partial" ? "Частично" : "Нарушение"}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 mb-2">{req.legalBasis}</p>
                      {req.documents.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {req.documents.map((doc, idx) => (
                            <span key={idx} className="text-xs px-2 py-1 bg-white rounded border border-slate-200 text-slate-600">
                              {doc}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Audit Check */}
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="font-medium text-slate-900 mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-violet-600" />
                  Проверка на риски
                </h3>
                <div className="space-y-2">
                  {auditChecks.map((check: AuditCheck) => (
                    <div key={check.id} className="flex items-center justify-between py-2">
                      <span className="text-sm text-slate-700">{check.check}</span>
                      <div className="flex items-center gap-2">
                        {check.status === "passed" && (
                          <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                            <CheckCircle2 className="w-4 h-4" />
                            Пройдено
                          </span>
                        )}
                        {check.status === "warning" && (
                          <span className="flex items-center gap-1 text-xs font-medium text-amber-600">
                            <AlertCircle className="w-4 h-4" />
                            Требует внимания
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Generated Response */}
          {generatedResponse && (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                <h3 className="font-medium text-slate-900 flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-emerald-600" />
                  Сгенерированный ответ
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Копировать"
                  >
                    {copied ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <Copy className="w-5 h-5 text-slate-500" />
                    )}
                  </button>
                  <button
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Скачать"
                  >
                    <Download className="w-5 h-5 text-slate-500" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <textarea
                  readOnly
                  value={generatedResponse}
                  className="w-full h-96 p-4 bg-slate-50 rounded-lg border border-slate-200 resize-none font-mono text-sm leading-relaxed"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
