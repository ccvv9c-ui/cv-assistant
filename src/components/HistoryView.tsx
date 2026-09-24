import React from 'react';
import { FolderHeart, Download, Trash2, ArrowRight, FileImage, Sparkles, HardDrive, ShieldCheck } from 'lucide-react';
import { ProcessedHistoryItem } from '../types';
import { triggerHaptic, formatBytes } from '../utils/haptics';

interface HistoryViewProps {
  history: ProcessedHistoryItem[];
  onBackToHome: () => void;
  onClearHistory: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  history,
  onBackToHome,
  onClearHistory,
}) => {
  const totalSavedBytes = history.reduce((acc, curr) => {
    return acc + Math.max(0, curr.fileSizeOriginal - curr.fileSizeProcessed);
  }, 0);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 pb-28 animate-in fade-in duration-200 text-right" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <FolderHeart className="w-6 h-6 text-cyan-400" />
            <span>ملفاتي المحفوظة وسجل المعالجة</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            كافة العمليات التي نفذتها محلياً على هذا الجهاز
          </p>
        </div>

        {history.length > 0 && (
          <button
            type="button"
            onClick={() => {
              triggerHaptic('medium');
              onClearHistory();
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 text-xs border border-white/[0.08] transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>مسح السجل</span>
          </button>
        )}
      </div>

      {/* Summary Stat Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="p-4 rounded-2xl glass-card border border-white/[0.08]">
          <span className="text-xs text-slate-400 block mb-1">إجمالي العمليات المنفذة:</span>
          <span className="text-2xl font-bold text-cyan-400 tabular-nums font-mono">
            {history.length} ملفات
          </span>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-emerald-500/20">
          <span className="text-xs text-emerald-400/90 block mb-1">إجمالي المساحة الموفرة:</span>
          <span className="text-2xl font-bold text-emerald-300 tabular-nums font-mono">
            {formatBytes(totalSavedBytes)}
          </span>
        </div>
      </div>

      {/* List */}
      {history.length === 0 ? (
        <div className="py-16 text-center rounded-3xl glass-card border border-white/[0.08] p-8 space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-slate-500 mx-auto">
            <FolderHeart className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">لا توجد ملفات محفوظة بعد</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
            عند قيامك بتحويل أو ضغط الصور أو توليد رموز QR، ستظهر ملفاتك هنا لتتمكن من الرجوع إليها وتحميلها.
          </p>
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              onBackToHome();
            }}
            className="mt-2 px-5 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-semibold"
          >
            استكشف أدوات المنصة الآن
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-2xl glass-card border border-white/[0.08] flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                {item.previewUrl ? (
                  <img
                    src={item.previewUrl}
                    alt={item.fileName}
                    className="w-12 h-12 rounded-xl object-cover border border-white/10 shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center shrink-0 text-cyan-400">
                    <FileImage className="w-5 h-5" />
                  </div>
                )}

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-bold text-white truncate max-w-[200px] sm:max-w-xs">
                      {item.fileName}
                    </span>
                    {item.format && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-300">
                        {item.format}
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                    <span>{item.toolName}</span>
                    <span>·</span>
                    <span className="font-mono text-emerald-400">{formatBytes(item.fileSizeProcessed || item.fileSizeOriginal)}</span>
                  </div>
                </div>
              </div>

              {item.previewUrl && (
                <a
                  href={item.previewUrl}
                  download={item.fileName}
                  onClick={() => triggerHaptic('light')}
                  className="p-2.5 rounded-xl bg-white/[0.05] hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-white/[0.08] transition-colors shrink-0"
                  title="تحميل مجدداً"
                >
                  <Download className="w-4 h-4" />
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
