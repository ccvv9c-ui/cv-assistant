import React, { useState } from 'react';
import { X, User, Mail, Shield, Smartphone, HardDrive, Info, Check, RefreshCw } from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  userEmail: string;
  onUpdateProfile: (name: string, email: string) => void;
  onClearData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  userName,
  userEmail,
  onUpdateProfile,
  onClearData,
}) => {
  const [name, setName] = useState(userName);
  const [email, setEmail] = useState(userEmail);
  const [hapticEnabled, setHapticEnabled] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic('medium');
    onUpdateProfile(name, email);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg glass-panel-elevated rounded-3xl p-5 sm:p-6 border border-white/[0.14] shadow-2xl overflow-y-auto max-h-[90vh] text-right"
        dir="rtl"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">إعدادات الحساب والنظام</h2>
              <p className="text-xs text-slate-400">تخصيص الجلسة وخيارات المعالجة والأمان</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5 space-y-5">
          {/* User Profile Form (Supabase Session representation) */}
          <form onSubmit={handleSaveProfile} className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-cyan-400">بيانات الحساب (Supabase Session)</span>
              <span className="text-[10px] text-emerald-400 font-mono">جلسة نشطة وموثقة</span>
            </div>

            <div>
              <label className="block text-[11px] text-slate-300 mb-1">الاسم المعروض:</label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-cyan-500/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-slate-300 mb-1">البريد الإلكتروني:</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-cyan-500/50 font-sans"
                  dir="ltr"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-98"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">تم حفظ التغييرات بنجاح</span>
                </>
              ) : (
                <span>تحديث بيانات الجلسة</span>
              )}
            </button>
          </form>

          {/* Preferences */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-3">
            <span className="text-xs font-bold text-white block">التفضيلات والتفاعل</span>

            <div className="flex items-center justify-between py-1">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-violet-400" />
                <span className="text-xs text-slate-300">الاهتزاز والتفاعل اللمسي (Haptics)</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('selection');
                  setHapticEnabled(!hapticEnabled);
                }}
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                  hapticEnabled ? 'bg-cyan-500' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    hapticEnabled ? 'translate-x-0' : '-translate-x-5'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Local Data & Cache */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <HardDrive className="w-4 h-4 text-amber-400" />
              <span>إدارة الذاكرة والملفات المؤقتة</span>
            </div>
            <p className="text-[11px] text-slate-400">
              يتم تخزين سجل العمليات محلياً فقط في متصفحك لتتمكن من الرجوع لملفاتك المحولة.
            </p>
            <button
              type="button"
              onClick={() => {
                triggerHaptic('heavy');
                onClearData();
                onClose();
              }}
              className="mt-2 text-xs text-rose-400 hover:text-rose-300 hover:underline flex items-center gap-1"
            >
              مسح سجل العمليات والذاكرة المؤقتة بالكامل
            </button>
          </div>

          {/* About OmniMedia Studio */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] text-[11px] text-slate-400 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-300">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>بيئة الأدوات (OmniMedia Studio v3.2)</span>
            </div>
            <p>
              تم تصميم هذه البيئة وفق معايير Material 3 Expressive و Dark Cyber-Glassmorphism لتقديم أعلى مستويات السرعة والخصوصية على الويب والأجهزة الذكية.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
