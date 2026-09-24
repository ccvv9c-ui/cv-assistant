import React from 'react';
import { SearchX, Sparkles } from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';

interface EmptySearchStateProps {
  searchQuery: string;
  onClear: () => void;
  onSuggest: (term: string) => void;
}

export const EmptySearchState: React.FC<EmptySearchStateProps> = ({
  searchQuery,
  onClear,
  onSuggest,
}) => {
  const suggestions = ['صور', 'ضغط', 'QR', 'ألوان', 'PDF', 'تحويل'];

  return (
    <div className="w-full py-12 px-4 rounded-3xl glass-card border border-white/[0.08] text-center flex flex-col items-center justify-center animate-in fade-in duration-300">
      <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-slate-400 mb-4 shadow-[0_0_20px_rgba(6,182,212,0.1)]">
        <SearchX className="w-8 h-8 text-cyan-400/80" />
      </div>

      <h3 className="text-base sm:text-lg font-bold text-white mb-1">
        لم يتم العثور على أداة باسم "{searchQuery}"
      </h3>
      <p className="text-xs sm:text-sm text-slate-400 max-w-md mb-5 leading-relaxed">
        تحقق من كتابة الكلمة بشكل صحيح، أو جرّب أحد الكلمات المفتاحية المقترحة أدناه:
      </p>

      {/* Suggestion Chips */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
        {suggestions.map((term) => (
          <button
            key={term}
            type="button"
            onClick={() => {
              triggerHaptic('light');
              onSuggest(term);
            }}
            className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-medium text-slate-300 hover:text-cyan-300 transition-colors active:scale-95"
          >
            #{term}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => {
          triggerHaptic('light');
          onClear();
        }}
        className="px-5 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-semibold transition-all active:scale-95"
      >
        إعادة عرض كافة الأدوات
      </button>
    </div>
  );
};
