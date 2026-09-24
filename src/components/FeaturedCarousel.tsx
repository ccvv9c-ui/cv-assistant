import React, { useState, useEffect } from 'react';
import { Zap, QrCode, Sparkles, ChevronLeft, ChevronRight, ShieldCheck, ArrowLeft } from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';

interface FeaturedCarouselProps {
  onQuickAction: (toolId: string) => void;
  recentProcessedCount: number;
}

export const FeaturedCarousel: React.FC<FeaturedCarouselProps> = ({
  onQuickAction,
  recentProcessedCount,
}) => {
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    {
      id: 'image-converter',
      tag: 'الأدوات الأكثر استخداماً',
      title: 'تحويل سريع للصور ⚡',
      description: 'حوّل صورك بين صيغ WebP و PNG و JPG فورياً داخل المتصفح بأقصى سرعة وبدون رفع للإنترنت.',
      actionLabel: 'بدء التحويل الآن',
      gradient: 'from-violet-600/30 via-indigo-600/20 to-blue-600/10',
      borderGlow: 'border-violet-500/30',
      accentColor: 'text-violet-400',
      badgeBg: 'bg-violet-500/20 text-violet-300',
      icon: Sparkles,
      stat: 'أكثر من 1,200 عملية تحويل',
    },
    {
      id: 'qr-studio',
      tag: 'جديد ومميّز',
      title: 'استوديو رموز QR الملوّنة',
      description: 'اصنع رموز QR احترافية ومخصصة بشعارات مدمجة وتدرجات ألوان عالية الدقة جاهزة للطباعة.',
      actionLabel: 'تصميم رمز QR',
      gradient: 'from-emerald-600/30 via-teal-600/20 to-cyan-600/10',
      borderGlow: 'border-emerald-500/30',
      accentColor: 'text-emerald-400',
      badgeBg: 'bg-emerald-500/20 text-emerald-300',
      icon: QrCode,
      stat: 'تصدير PNG و SVG مجاناً',
    },
    {
      id: 'image-compressor',
      tag: 'توفير المساحة',
      title: 'ضاغط الصور الذكي',
      description: 'قلل حجم صورك حتى 85% مع الحفاظ التام على ألوانها وتفاصيلها الحادة لتسريع مواقعك وتطبيقاتك.',
      actionLabel: 'ضغط صورة الآن',
      gradient: 'from-amber-600/30 via-orange-600/20 to-rose-600/10',
      borderGlow: 'border-amber-500/30',
      accentColor: 'text-amber-400',
      badgeBg: 'bg-amber-500/20 text-amber-300',
      icon: Zap,
      stat: 'معالجة محلية فورية',
    },
  ];

  // Auto advance smoothly every 7 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const current = slides[activeSlide];
  const IconComponent = current.icon;

  const handleNext = () => {
    triggerHaptic('light');
    setActiveSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    triggerHaptic('light');
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative w-full rounded-3xl overflow-hidden glass-card p-5 sm:p-6 border transition-all duration-300">
      {/* Background ambient gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${current.gradient} opacity-90 transition-opacity duration-700 pointer-events-none`}
      />

      {/* Decorative cyber grid or shape */}
      <div className="absolute -top-12 -left-12 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -right-10 w-44 h-44 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col justify-between gap-4">
        {/* Top Header Row with Quiet Tag & Slide Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-cyan-300 tracking-wide">
              {current.tag}
            </span>
            <span className="text-slate-600 text-xs">·</span>
            <span className="text-xs text-slate-400">{current.stat}</span>
          </div>

          {/* Carousel navigation indicators */}
          <div className="flex items-center gap-1.5" dir="ltr">
            <button
              type="button"
              onClick={handlePrev}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 active:scale-90 transition-colors"
              aria-label="السابق"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-1 px-1">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    triggerHaptic('selection');
                    setActiveSlide(idx);
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === activeSlide ? 'w-5 bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]' : 'w-1.5 bg-white/20 hover:bg-white/40'
                  }`}
                  aria-label={`شريحة ${idx + 1}`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={handleNext}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 active:scale-90 transition-colors"
              aria-label="التالي"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-1">
          <div className="space-y-2 max-w-xl text-right">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <span>{current.title}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {current.description}
            </p>
          </div>

          {/* Primary Action Button */}
          <div className="shrink-0 flex items-center">
            <button
              type="button"
              onClick={() => {
                triggerHaptic('medium');
                onQuickAction(current.id);
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white font-semibold text-xs sm:text-sm shadow-[0_4px_20px_rgba(6,182,212,0.35)] active:scale-95 transition-all duration-200"
            >
              <span>{current.actionLabel}</span>
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            </button>
          </div>
        </div>

        {/* Quiet footnote bar */}
        <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>معالجة محلية 100% بدون إرسال ملفاتك لأي خادم</span>
          </div>
          {recentProcessedCount > 0 && (
            <span className="text-slate-400">
              أجريت {recentProcessedCount} عملية اليوم
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
