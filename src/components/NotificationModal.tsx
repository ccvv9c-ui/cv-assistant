import React from 'react';
import { X, Bell, ShieldCheck, CheckCircle2, Info, Trash2 } from 'lucide-react';
import { AppNotification } from '../types';
import { triggerHaptic } from '../utils/haptics';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onClearAll: () => void;
  onMarkRead: (id: string) => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onClearAll,
  onMarkRead,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md glass-panel-elevated rounded-3xl p-5 border border-white/[0.14] shadow-2xl overflow-y-auto max-h-[85vh] text-right"
        dir="rtl"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white">مركز التنبيهات</h3>
              <p className="text-[11px] text-slate-400">آخر المستجدات وحالة المعالجة المحلية</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {notifications.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  onClearAll();
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-white/[0.05] transition-colors"
                title="مسح كافة الإشعارات"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                triggerHaptic('light');
                onClose();
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="mt-4 space-y-2.5">
          {notifications.length === 0 ? (
            <div className="py-10 text-center text-slate-500 text-xs">
              لا توجد تنبيهات جديدة في الوقت الحالي
            </div>
          ) : (
            notifications.map((n) => {
              const Icon = n.type === 'security' ? ShieldCheck : n.type === 'success' ? CheckCircle2 : Info;
              const colorClass =
                n.type === 'security'
                  ? 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30'
                  : n.type === 'success'
                  ? 'text-cyan-400 bg-cyan-500/15 border-cyan-500/30'
                  : 'text-violet-400 bg-violet-500/15 border-violet-500/30';

              return (
                <div
                  key={n.id}
                  onClick={() => onMarkRead(n.id)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                    n.isRead
                      ? 'bg-white/[0.02] border-white/[0.06] text-slate-400'
                      : 'bg-white/[0.05] border-white/[0.12] text-slate-200 shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 ${colorClass}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs font-bold text-white truncate">{n.title}</span>
                        <span className="text-[10px] text-slate-500 font-sans">{n.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{n.message}</p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
