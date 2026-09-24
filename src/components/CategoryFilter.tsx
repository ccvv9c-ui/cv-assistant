import React from 'react';
import { CATEGORIES } from '../data/toolsData';
import { CategoryType } from '../types';
import { triggerHaptic } from '../utils/haptics';

interface CategoryFilterProps {
  activeCategory: CategoryType;
  onSelectCategory: (category: CategoryType) => void;
  toolCounts: Record<CategoryType, number>;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  activeCategory,
  onSelectCategory,
  toolCounts,
}) => {
  return (
    <div className="w-full overflow-x-auto no-scrollbar py-1">
      <div className="flex items-center gap-1.5 min-w-max p-1 bg-white/[0.03] rounded-2xl border border-white/[0.06] backdrop-blur-md">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          const count = toolCounts[cat.id as CategoryType] || 0;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                triggerHaptic('selection');
                onSelectCategory(cat.id as CategoryType);
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-200 active:scale-95 ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/20 to-violet-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] border border-transparent'
              }`}
            >
              <span>{cat.label}</span>
              <span
                className={`text-[10px] tabular-nums font-sans px-1.5 py-0.2 rounded-md ${
                  isActive ? 'bg-cyan-500/20 text-cyan-200' : 'bg-white/[0.06] text-slate-500'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
