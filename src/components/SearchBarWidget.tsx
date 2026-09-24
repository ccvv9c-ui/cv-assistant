import React from 'react';
import { Search, X, Sparkles } from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';

interface SearchBarWidgetProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  resultCount?: number;
  totalCount?: number;
}

export const SearchBarWidget: React.FC<SearchBarWidgetProps> = ({
  searchQuery,
  onSearchChange,
  resultCount,
  totalCount,
}) => {
  return (
    <div className="relative w-full">
      <div className="relative flex items-center group">
        {/* Search Icon */}
        <div className="absolute right-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-cyan-400 transition-colors">
          <Search className="w-5 h-5" />
        </div>

        {/* Search Input */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="ابحث عن أي أداة... (مثل: ضغط، تحويل، QR، ألوان)"
          className="w-full pr-11 pl-10 py-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.06] focus:bg-[#0e1628] border border-white/[0.08] focus:border-cyan-500/50 text-slate-100 placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 backdrop-blur-xl transition-all duration-200"
          dir="rtl"
        />

        {/* Clear Button */}
        {searchQuery ? (
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              onSearchChange('');
            }}
            className="absolute left-3 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 active:scale-90 transition-all"
            aria-label="مسح البحث"
          >
            <X className="w-4 h-4" />
          </button>
        ) : (
          <div className="absolute left-3 text-slate-600 hidden sm:flex items-center gap-1 text-[11px] pointer-events-none">
            <kbd className="px-1.5 py-0.5 rounded bg-white/[0.05] border border-white/[0.08] font-mono">⌘K</kbd>
          </div>
        )}
      </div>

      {/* Real-time search feedback (quiet metadata, zero-pill discipline) */}
      {searchQuery && (
        <div className="flex items-center justify-between mt-2 px-1 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>
              تم العثور على {resultCount} أداة من أصل {totalCount}
            </span>
          </div>
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="text-cyan-400 hover:underline hover:text-cyan-300"
          >
            إعادة تعيين
          </button>
        </div>
      )}
    </div>
  );
};
