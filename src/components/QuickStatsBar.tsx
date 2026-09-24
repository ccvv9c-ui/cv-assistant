import React, { useState } from 'react';
import { ShieldCheck, HardDrive, Cpu, WifiOff, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';

interface QuickStatsBarProps {
  processedCount: number;
  savedSpaceBytes: number;
}

export const QuickStatsBar: React.FC<QuickStatsBarProps> = ({
  processedCount,
  savedSpaceBytes,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="w-full rounded-2xl glass-panel border border-emerald-500/20 p-3.5 transition-all duration-300">
      <div className="flex items-center justify-between gap-3">
        {/* Main Status & Guarantee */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(16,185,129,0.2)]">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-300">
                العمليات المنفذة على جهازك محلياً
              </span>
              <span className="flex items-center gap-1 text-[10px] text-emerald-400/90 font-mono bg-emerald-500/10 px-1.5 py-0.5 rounded-md border border-emerald-500/20">
                <WifiOff className="w-2.5 h-2.5" />
                <span>100% أوفلاين وآمن</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              ملفاتك وصورك لا تغادر متصفحك أبداً. تتم كافة العمليات داخل الذاكرة المحلية (Client-Side Memory).
            </p>
          </div>
        </div>

        {/* Toggle Details */}
        <button
          type="button"
          onClick={() => {
            triggerHaptic('light');
            setIsExpanded(!isExpanded);
          }}
          className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.05] transition-colors shrink-0"
          aria-label="تفاصيل الأمان"
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Expanded detailed architecture metrics */}
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-white/[0.06] grid grid-cols-1 sm:grid-cols-3 gap-2 text-right">
          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>محرك المعالجة</span>
            </div>
            <span className="text-xs font-semibold text-slate-200">
              WebAssembly & Canvas 2D
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>العمليات المنجزة</span>
            </div>
            <span className="text-xs font-semibold text-slate-200 tabular-nums">
              {processedCount} عملية ناجحة
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
              <HardDrive className="w-3.5 h-3.5 text-violet-400" />
              <span>خصوصية البيانات</span>
            </div>
            <span className="text-xs font-semibold text-slate-200">
              صفر تخزين سحابي (Zero Cloud Retention)
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
