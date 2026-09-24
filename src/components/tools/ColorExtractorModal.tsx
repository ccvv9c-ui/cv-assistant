import React, { useState, useRef } from 'react';
import { X, Upload, Palette, Copy, Check, Sparkles, Layers, Sliders } from 'lucide-react';
import { triggerHaptic } from '../../utils/haptics';
import confetti from 'canvas-confetti';
import { ProcessedHistoryItem } from '../../types';

interface ColorExtractorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToHistory: (item: ProcessedHistoryItem) => void;
}

interface ColorSwatch {
  hex: string;
  rgb: string;
  pct: number;
}

export const ColorExtractorModal: React.FC<ColorExtractorModalProps> = ({
  isOpen,
  onClose,
  onAddToHistory,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [colors, setColors] = useState<ColorSwatch[]>([
    { hex: '#0f172a', rgb: '15, 23, 42', pct: 35 },
    { hex: '#06b6d4', rgb: '6, 182, 212', pct: 24 },
    { hex: '#a855f7', rgb: '168, 85, 247', pct: 18 },
    { hex: '#10b981', rgb: '16, 185, 129', pct: 14 },
    { hex: '#f59e0b', rgb: '245, 158, 11', pct: 9 },
  ]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Process uploaded image and extract real dominant colors from pixels
  const extractColorsFromImage = (imgSrc: string) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = imgSrc;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Sample a scaled down 60x60 version for fast color quantization
      const size = 60;
      canvas.width = size;
      canvas.height = size;
      ctx.drawImage(img, 0, 0, size, size);

      const imageData = ctx.getImageData(0, 0, size, size).data;
      const colorCounts: Record<string, number> = {};

      for (let i = 0; i < imageData.length; i += 16) { // step by 4 pixels
        const r = Math.round(imageData[i] / 24) * 24;
        const g = Math.round(imageData[i + 1] / 24) * 24;
        const b = Math.round(imageData[i + 2] / 24) * 24;
        const a = imageData[i + 3];

        if (a > 128) {
          const key = `${r},${g},${b}`;
          colorCounts[key] = (colorCounts[key] || 0) + 1;
        }
      }

      // Sort and take top 5-6 dominant colors
      const sorted = Object.entries(colorCounts).sort((a, b) => b[1] - a[1]);
      const totalSamples = sorted.slice(0, 5).reduce((acc, curr) => acc + curr[1], 0) || 1;

      const swatches: ColorSwatch[] = sorted.slice(0, 5).map(([rgbKey, count]) => {
        const [r, g, b] = rgbKey.split(',').map(Number);
        const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
        return {
          hex,
          rgb: `${r}, ${g}, ${b}`,
          pct: Math.round((count / totalSamples) * 100),
        };
      });

      if (swatches.length > 0) {
        setColors(swatches);
      }
    };
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setSelectedImage(url);
      extractColorsFromImage(url);
      triggerHaptic('light');

      onAddToHistory({
        id: Date.now().toString(),
        toolId: 'color-extractor',
        toolName: 'مستخرج ألوان الصور',
        fileName: file.name,
        fileSizeOriginal: file.size,
        fileSizeProcessed: 0,
        timestamp: Date.now(),
        previewUrl: url,
        format: 'PALETTE',
      });
    }
  };

  const handleCopy = (code: string) => {
    triggerHaptic('medium');
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 1800);
  };

  // Gradient CSS from top 2 colors
  const gradientCss = `linear-gradient(135deg, ${colors[0]?.hex || '#06b6d4'} 0%, ${colors[1]?.hex || '#a855f7'} 100%)`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl glass-panel-elevated rounded-3xl p-5 sm:p-6 border border-white/[0.14] shadow-2xl overflow-y-auto max-h-[90vh] text-right"
        dir="rtl"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-600 p-0.5 flex items-center justify-center">
              <Palette className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">مستخرج ألوان الصور</h2>
              <p className="text-xs text-slate-400">استخراج الأكواد وتناسق الألوان وتوليد التدرجات</p>
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

        {/* Upload or Preset Area */}
        <div className="mt-5 space-y-4">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-white/20 hover:border-pink-400/50 rounded-2xl p-4 text-center cursor-pointer bg-white/[0.02] hover:bg-white/[0.05] transition-all flex items-center justify-center gap-3"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <div className="w-9 h-9 rounded-xl bg-pink-500/15 text-pink-400 flex items-center justify-center">
              <Upload className="w-5 h-5" />
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-white">ارفع صورة لتحليل باليتة ألوانها</p>
              <p className="text-[11px] text-slate-400">يدعم PNG و JPG و WebP</p>
            </div>
          </div>

          {/* Active Image Thumbnail if selected */}
          {selectedImage && (
            <div className="relative h-24 rounded-2xl overflow-hidden border border-white/10">
              <img src={selectedImage} alt="Sample" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                <span className="text-xs text-white font-medium">تم استخراج الألوان من الصورة المحددة بنجاح</span>
              </div>
            </div>
          )}

          {/* Swatches List */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              الألوان المستخرجة (اضغط على أي كود لنسخه):
            </label>
            <div className="space-y-2">
              {colors.map((color, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-white/[0.15] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl border border-white/20 shadow-sm shrink-0"
                      style={{ backgroundColor: color.hex }}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white font-mono">{color.hex}</span>
                        <span className="text-[10px] text-slate-400">({color.pct}%)</span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">RGB: {color.rgb}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopy(color.hex)}
                    className="px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-medium text-slate-200 flex items-center gap-1.5 transition-all active:scale-95"
                  >
                    {copiedCode === color.hex ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-bold">تم النسخ</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                        <span>نسخ HEX</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Generated CSS Gradient from extracted palette */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">تدرج لوني مولّد تلقائياً (CSS Gradient):</span>
              <button
                type="button"
                onClick={() => handleCopy(`background: ${gradientCss};`)}
                className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                <Copy className="w-3 h-3" />
                <span>{copiedCode?.includes('background') ? 'تم النسخ!' : 'نسخ كود CSS'}</span>
              </button>
            </div>

            {/* Gradient visual bar */}
            <div
              className="w-full h-10 rounded-xl shadow-inner border border-white/20 transition-all"
              style={{ background: gradientCss }}
            />

            <code className="block p-2 rounded-xl bg-black/40 text-[11px] font-mono text-cyan-300 break-all" dir="ltr">
              background: {gradientCss};
            </code>
          </div>
        </div>
      </div>
    </div>
  );
};
