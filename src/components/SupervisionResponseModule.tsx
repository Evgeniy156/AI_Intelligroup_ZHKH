import { useState } from "react";
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
import { mockRequirements, auditChecks } from "@/mocks/data";

export function SupervisionResponseModule() {
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [generatedResponse, setGeneratedResponse] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const handleFileUpload = () => {
    setUploadedFile("predpisanie_gji_45_2024.pdf");
    setIsAnalyzing(true);
    // TODO: заменить на вызов api.analyzeDocument() при подключении бэкенда
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisComplete(true);
    }, 2000);
  };

  const handleGenerateResponse = () => {
    // TODO: заменить на вызов api.generateSupervisionResponse() при подключении бэкенда
    const response = `В Управление Государственного жилищного надзора Московской области


Исх. № 156 от ${new Date().toLocaleDateString("ru-RU")}


На предписание от 10.01.2024 № 45-2024


Управляющая организация ООО "УК ЖилКомфорт", действующая на основании лицензии № 12345, 
в соответствии с Федеральным законом от 21.07.1997 № 116-ФЗ «О промышленной безопасности...», 
сообщает следующее.


В предписании от 10.01.2024 № 45-2024 содержится требование об устранении нарушений 
температурного режима в жилом доме по адресу: г. Москва, ул. Ленина, д. 15.


Сообщаем, что в установленный законом срок нарушения были устранены. 


В соответствии с пунктом 15 Постановления Правительства РФ от 06.05.2011 № 354 
"О предоставлении коммунальных услуг собственникам и пользователям помещений..." 
исполнитель обязан обеспечить надлежащее качество коммунальных услуг.


Акт проверки качества коммунальной услуги от 15.01.2024 подтверждает, 
что температура в жилых помещениях соответствует нормативным значениям 
(не ниже +20°С для жилых комнат).


На основании изложенного, руководствуясь статьями 4, 10 Федерального закона 
от 26.12.2008 № 294-ФЗ, просим considers предписание исполненным.


Приложения:
1. Акт проверки от 15.01.2024 - 1 л.
2. Акт выполненных работ - 1 л.
3. Выписка из журнала учета обращений - 1 л.


Генеральный директор _______________ Иванов И.И.


М.П.`;

    setGeneratedResponse(response);
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

            {!uploadedFile ? (
              <div
                onClick={handleFileUpload}
                className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-emerald-400 hover:bg-emerald-50/50 transition-all cursor-pointer"
              >
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-emerald-600" />
                </div>
                <p className="font-medium text-slate-900 mb-1">Загрузите предписание или запрос</p>
                <p className="text-sm text-slate-500">PDF, DOCX до 10 МБ</p>
              </div>
            ) : (
              <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg">
                    <FileText className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">{uploadedFile}</p>
                    <p className="text-sm text-slate-500">PDF, 2.4 МБ • Загружено</p>
                  </div>
                  <button
                    onClick={() => { setUploadedFile(null); setAnalysisComplete(false); setGeneratedResponse(""); }}
                    className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                  >
                    <AlertCircle className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Document Info */}
          {uploadedFile && (
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="font-medium text-slate-900 mb-4">Информация о документе</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-sm text-slate-500">Отправитель</p>
                    <p className="font-medium text-slate-900">ГЖИ Московской области</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Hash className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-sm text-slate-500">Номер</p>
                    <p className="font-medium text-slate-900">45-2024</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-sm text-slate-500">Дата</p>
                    <p className="font-medium text-slate-900">10 января 2024</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-sm text-slate-500">Срок ответа</p>
                    <p className="font-medium text-amber-700">до 30 января 2024 (10 дней)</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Generate Button */}
          {analysisComplete && !generatedResponse && (
            <button
              onClick={handleGenerateResponse}
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-emerald-200 transition-all flex items-center justify-center gap-2"
            >
              <FileCheck className="w-5 h-5" />
              Сгенерировать ответ
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
                  {mockRequirements.map((req) => (
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
                  {auditChecks.map((check) => (
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
