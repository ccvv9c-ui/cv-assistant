import React from 'react';
import { 
  Sparkles, 
  Minimize2, 
  QrCode, 
  Palette, 
  FileText, 
  ShieldCheck, 
  ChevronLeft,
  ArrowUpLeft
} from 'lucide-react';
import { ToolItem } from '../types';
import { triggerHaptic } from '../utils/haptics';

interface ToolCardProps {
  tool: ToolItem;
  onSelect: (tool: ToolItem) => void;
  index: number;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool, onSelect, index }) => {
  const renderIcon = () => {
    switch (tool.iconName) {
      case 'auto_fix_high':
        return <Sparkles className="w-5 h-5 text-white" />;
      case 'compress':
        return <Minimize2 className="w-5 h-5 text-white" />;
      case 'qr_code_2':
        return <QrCode className="w-5 h-5 text-white" />;
      case 'palette_outlined':
        return <Palette className="w-5 h-5 text-white" />;
      case 'picture_as_pdf_outlined':
        return <FileText className="w-5 h-5 text-white" />;
      case 'security':
        return <ShieldCheck className="w-5 h-5 text-white" />;
      default:
        return <Sparkles className="w-5 h-5 text-white" />;
    }
  };

  return (
    <button
      type="button"
      onClick={() => {
        triggerHaptic('medium');
        onSelect(tool);
      }}
      className="group relative w-full text-right p-4 sm:p-5 rounded-3xl glass-card border border-white/[0.1] hover:border-white/[0.22] cursor-pointer flex flex-col justify-between overflow-hidden transition-all duration-300 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
      style={{
        animationDelay: `${index * 60}ms`,
      }}
    >
      {/* Ambient hover glow inside card */}
      <div 
        className="absolute -top-12 -right-12 w-28 h-28 rounded-full opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-500 pointer-events-none"
        style={{ backgroundColor: tool.accentColor }}
      />

      {/* Top row: Icon with specialized gradient + Open indicator */}
      <div className="flex items-center justify-between mb-3 w-full">
        {/* Icon Container with vibrant gradient */}
        <div 
          className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${tool.gradient} p-0.5 shadow-md flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}
        >
          <div className="w-full h-full rounded-[14px] bg-black/20 backdrop-blur-xs flex items-center justify-center">
            {renderIcon()}
          </div>
        </div>

        {/* Action arrow and optional badge */}
        <div className="flex items-center gap-1.5">
          {tool.badge && (
            <span className="text-[10px] font-medium text-slate-400 group-hover:text-cyan-300 transition-colors">
              {tool.badge}
            </span>
          )}
          <div className="w-7 h-7 rounded-xl bg-white/[0.04] group-hover:bg-white/[0.1] border border-white/[0.06] flex items-center justify-center text-slate-400 group-hover:text-white transition-all">
            <ArrowUpLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </div>
      </div>

      {/* Title & Description */}
      <div className="space-y-1 w-full text-right">
        <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-cyan-200 transition-colors truncate">
          {tool.title}
        </h3>
        <p className="text-xs text-slate-400 group-hover:text-slate-300 leading-snug line-clamp-2">
          {tool.subtitle}
        </p>
      </div>

      {/* Bottom Category link */}
      <div className="mt-3 pt-2.5 border-t border-white/[0.05] flex items-center justify-between text-[11px] text-slate-400">
        <span>{tool.categoryName}</span>
        <span className="text-[10px] text-emerald-400 font-mono">100% محلي</span>
      </div>
    </button>
  );
};
