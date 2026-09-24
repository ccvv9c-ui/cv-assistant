import React, { useState, useRef } from 'react';
import { X, Upload, Sparkles, Download, Check, RefreshCw, FileImage, ArrowRight } from 'lucide-react';
import { triggerHaptic, formatBytes } from '../../utils/haptics';
import confetti from 'canvas-confetti';
import { ProcessedHistoryItem } from '../../types';

interface ImageConverterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToHistory: (item: ProcessedHistoryItem) => void;
}

export const ImageConverterModal: React.FC<ImageConverterModalProps> = ({
  isOpen,
  onClose,
  onAddToHistory,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [targetFormat, setTargetFormat] = useState<'image/webp' | 'image/png' | 'image/jpeg'>('image/webp');
  const [quality, setQuality] = useState<number>(0.85);
  const [isProcessing, setIsProcessing] = useState(false);
  const [convertedResult, setConvertedResult] = useState<{
    blob: Blob;
    url: string;
    size: number;
    extension: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setConvertedResult(null);
      triggerHaptic('light');
    }
  };

  const handleConvert = async () => {
    if (!selectedFile || !previewUrl) return;

    setIsProcessing(true);
    triggerHaptic('medium');

    try {
      const img = new Image();
      img.src = previewUrl;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');

      // If converting to JPEG, draw white background first
      if (targetFormat === 'image/jpeg') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            setIsProcessing(false);
            return;
          }

          const ext = targetFormat === 'image/webp' ? 'webp' : targetFormat === 'image/png' ? 'png' : 'jpg';
          const url = URL.createObjectURL(blob);

          setConvertedResult({
            blob,
            url,
            size: blob.size,
            extension: ext,
          });
          setIsProcessing(false);
          triggerHaptic('heavy');
        },
        targetFormat,
        quality
      );
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!convertedResult || !selectedFile) return;

    triggerHaptic('heavy');
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#06b6d4', '#a855f7', '#10b981'],
    });

    const baseName = selectedFile.name.substring(0, selectedFile.name.lastIndexOf('.')) || 'image';
    const downloadName = `${baseName}_omnistudio.${convertedResult.extension}`;

    const link = document.createElement('a');
    link.href = convertedResult.url;
    link.download = downloadName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    onAddToHistory({
      id: Date.now().toString(),
      toolId: 'image-converter',
      toolName: 'محول صيغ الصور',
      fileName: downloadName,
      fileSizeOriginal: selectedFile.size,
      fileSizeProcessed: convertedResult.size,
      timestamp: Date.now(),
      previewUrl: convertedResult.url,
      format: convertedResult.extension.toUpperCase(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl glass-panel-elevated rounded-3xl p-5 sm:p-6 border border-white/[0.14] shadow-2xl overflow-y-auto max-h-[90vh] text-right"
        dir="rtl"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 p-0.5 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">محول صيغ الصور</h2>
              <p className="text-xs text-slate-400">تحويل سريع بين WebP و PNG و JPG فائق السرعة</p>
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

        {/* Upload Zone */}
        {!selectedFile ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="mt-5 border-2 border-dashed border-white/20 hover:border-cyan-400/50 rounded-3xl p-8 text-center cursor-pointer bg-white/[0.02] hover:bg-white/[0.05] transition-all group"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <div className="w-14 h-14 rounded-2xl bg-white/[0.05] group-hover:bg-cyan-500/10 text-slate-400 group-hover:text-cyan-400 flex items-center justify-center mx-auto mb-3 transition-colors">
              <Upload className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-white mb-1">اضغط لاختيار صورة أو اسحبها هنا</p>
            <p className="text-xs text-slate-400">يدعم PNG, JPG, WebP, GIF, BMP (حتى 50 م.ب)</p>
          </div>
        ) : (
          <div className="mt-5 space-y-4">
            {/* Image Preview & Details */}
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={previewUrl || ''}
                  alt="Original Preview"
                  className="w-14 h-14 rounded-xl object-cover border border-white/10"
                />
                <div>
                  <p className="text-sm font-semibold text-white truncate max-w-[200px]">{selectedFile.name}</p>
                  <p className="text-xs text-slate-400">{formatBytes(selectedFile.size)}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedFile(null);
                  setPreviewUrl(null);
                  setConvertedResult(null);
                }}
                className="text-xs text-slate-400 hover:text-rose-400 underline"
              >
                تغيير الصورة
              </button>
            </div>

            {/* Target Format Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                اختر الصيغة الهدف:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'image/webp', label: 'WebP', desc: 'الأخف والأسرع للويب' },
                  { id: 'image/png', label: 'PNG', desc: 'دقة عالية مع شفافية' },
                  { id: 'image/jpeg', label: 'JPEG / JPG', desc: 'متوافق مع كل الأجهزة' },
                ].map((fmt) => (
                  <button
                    key={fmt.id}
                    type="button"
                    onClick={() => {
                      triggerHaptic('selection');
                      setTargetFormat(fmt.id as any);
                      setConvertedResult(null);
                    }}
                    className={`p-3 rounded-2xl border text-right transition-all ${
                      targetFormat === fmt.id
                        ? 'bg-cyan-500/15 border-cyan-500/50 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                        : 'bg-white/[0.03] border-white/[0.08] text-slate-400 hover:bg-white/[0.06]'
                    }`}
                  >
                    <div className="text-sm font-bold text-white">{fmt.label}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{fmt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quality Slider (for webp & jpeg) */}
            {targetFormat !== 'image/png' && (
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">مستوى الجودة:</span>
                  <span className="text-cyan-400 font-mono font-bold">{Math.round(quality * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.3"
                  max="1.0"
                  step="0.05"
                  value={quality}
                  onChange={(e) => {
                    setQuality(parseFloat(e.target.value));
                    setConvertedResult(null);
                  }}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>
            )}

            {/* Convert Trigger Button */}
            {!convertedResult ? (
              <button
                type="button"
                onClick={handleConvert}
                disabled={isProcessing}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-sm shadow-[0_4px_20px_rgba(129,140,248,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>جارِ التحويل داخل المتصفح...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>بدء التحويل الآن</span>
                  </>
                )}
              </button>
            ) : (
              /* Converted Results & Download */
              <div className="space-y-3 pt-2">
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 mb-1">
                      <Check className="w-4 h-4" />
                      <span>تم التحويل بنجاح!</span>
                    </div>
                    <div className="text-xs text-slate-300">
                      الحجم الأصلي: <span className="font-mono text-slate-400">{formatBytes(selectedFile.size)}</span>
                      {' → '}
                      الحجم الجديد: <span className="font-mono font-bold text-emerald-300">{formatBytes(convertedResult.size)}</span>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold">
                    .{convertedResult.extension.toUpperCase()}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleDownload}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-sm shadow-[0_4px_20px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-2 active:scale-98"
                >
                  <Download className="w-4 h-4" />
                  <span>تحميل الملف المحوّل</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
