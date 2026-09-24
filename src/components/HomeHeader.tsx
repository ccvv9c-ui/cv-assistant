import React from 'react';
import { Bell, Settings, Layers, ShieldCheck } from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';

interface HomeHeaderProps {
  userName?: string;
  userEmail?: string;
  unreadCount?: number;
  onOpenNotifications: () => void;
  onOpenSettings: () => void;
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({
  userName = 'حسام مرضي',
  userEmail = 'hosanmarzi@gmail.com',
  unreadCount = 2,
  onOpenNotifications,
  onOpenSettings,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full glass-panel border-b border-white/[0.08] px-4 py-3 sm:px-6">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
        {/* User Greeting & Status */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-violet-600 p-[1.5px] shadow-[0_0_15px_rgba(6,182,212,0.35)]">
              <div className="w-full h-full rounded-[10px] bg-[#0c1222] flex items-center justify-center font-bold text-cyan-400 text-sm">
                {userName.charAt(0)}
              </div>
            </div>
            {/* Online indicator dot */}
            <span 
              className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-[#0c1222] rounded-full"
              title="محرك المعالجة المحلي متصل وآمن"
            />
          </div>

          <div className="flex flex-col min-w-0 text-right">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-400 font-medium">أهلاً بك 👋</span>
              <span className="text-xs font-semibold text-slate-200 truncate">{userName}</span>
            </div>
            <span className="text-[11px] text-slate-500 truncate font-sans max-w-[150px] sm:max-w-[200px]" dir="ltr">
              {userEmail}
            </span>
          </div>
        </div>

        {/* Center: App Brand Logo with pulsating glow */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.07] backdrop-blur-md">
          <div className="relative flex items-center justify-center w-6 h-6">
            <div className="absolute inset-0 rounded-full bg-cyan-500/30 blur-[6px] animate-pulse" />
            <Layers className="w-4 h-4 text-cyan-400 relative z-10" />
          </div>
          <span className="text-xs font-bold tracking-wide bg-gradient-to-r from-cyan-400 via-violet-300 to-emerald-400 bg-clip-text text-transparent">
            بيئة الأدوات
          </span>
          <span className="text-[10px] text-slate-400 px-1 border-r border-slate-700">OmniMedia</span>
        </div>

        {/* Quick Actions (Notifications & Settings) */}
        <div className="flex items-center gap-2">
          {/* Notifications Button */}
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              onOpenNotifications();
            }}
            aria-label="الإشعارات والتنبيهات"
            className="relative min-w-[40px] min-h-[40px] w-10 h-10 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] active:scale-95 border border-white/[0.08] flex items-center justify-center text-slate-300 hover:text-white transition-all duration-200"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-r from-rose-500 to-amber-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-[#0c1222]">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Settings Button */}
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              onOpenSettings();
            }}
            aria-label="الإعدادات"
            className="min-w-[40px] min-h-[40px] w-10 h-10 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] active:scale-95 border border-white/[0.08] flex items-center justify-center text-slate-300 hover:text-white transition-all duration-200"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
