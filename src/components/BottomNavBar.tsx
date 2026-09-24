import React from 'react';
import { Home, FolderHeart, Settings } from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';

export type NavTab = 'home' | 'history' | 'settings';

interface BottomNavBarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  savedCount?: number;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onTabChange,
  savedCount = 0,
}) => {
  const tabs = [
    {
      id: 'home' as NavTab,
      label: 'الرئيسية',
      icon: Home,
    },
    {
      id: 'history' as NavTab,
      label: 'ملفاتي المحفوظة',
      icon: FolderHeart,
      badge: savedCount > 0 ? savedCount : undefined,
    },
    {
      id: 'settings' as NavTab,
      label: 'الإعدادات',
      icon: Settings,
    },
  ];

  return (
    <nav 
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-md"
      aria-label="شريط التنقل السفلي"
    >
      <div className="glass-panel-elevated rounded-3xl p-1.5 shadow-[0_12px_32px_rgba(0,0,0,0.6)] border border-white/[0.12] flex items-center justify-between">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                triggerHaptic('medium');
                onTabChange(tab.id);
              }}
              className={`relative flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl text-xs font-semibold transition-all duration-200 active:scale-95 ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/25 to-violet-600/25 text-white border border-cyan-400/30 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
              }`}
            >
              <div className="relative">
                <Icon className={`w-4 h-4 transition-transform ${isActive ? 'scale-110 text-cyan-400' : ''}`} />
                {tab.badge && (
                  <span className="absolute -top-1.5 -right-2 flex h-3.5 min-w-[14px] items-center justify-center rounded-full bg-cyan-500 px-1 text-[9px] font-bold text-[#080c16]">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="truncate">{tab.label}</span>
              {isActive && (
                <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
