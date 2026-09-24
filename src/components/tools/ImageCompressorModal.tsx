import React, { useState, useRef } from 'react';
import { X, Upload, Minimize2, Download, Check, RefreshCw, Zap, TrendingDown } from 'lucide-react';
import { triggerHaptic, formatBytes } from '../../utils/haptics';
import confetti from 'canvas-confetti';
import { ProcessedHistoryItem } from '../../types';

interface ImageCompressorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToHistory: (item: ProcessedHistoryItem) => void;
}

export const ImageCompressorModal: React.FC<ImageCompressorModalProps> = ({
  isOpen,
  onClose,
  onAddToHistory,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [compressionMode, setCompressionMode] = useState<'high' | 'balanced' | 'max'>('balanced');
  const [scaleFactor, setScaleFactor] = useState<number>(1.0);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressedResult, setCompressedResult] = useState<{
    blob: Blob;
    url: string;
    size: number;
    savingsPercent: number;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setCompressedResult(null);
      triggerHaptic('light');
    }
  };

  const handleCompress = async () => {
    if (!selectedFile || !previewUrl) return;

    setIsCompressing(true);
    triggerHaptic('medium');

    try {
      const img = new Image();
      img.src = previewUrl;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const canvas = document.createElement('canvas');
      const targetWidth = Math.round(img.width * scaleFactor);
      const targetHeight = Math.round(img.height * scaleFactor);
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');

      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      // Quality mapping
      const qualityValue = compressionMode === 'max' ? 0.45 : compressionMode === 'balanced' ? 0.72 : 0.88;

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            setIsCompressing(false);
            return;
          }

          const savings = Math.max(0, Math.round(((selectedFile.size - blob.size) / selectedFile.size) * 100));
          const url = URL.createObjectURL(blob);

          setCompressedResult({
            blob,
            url,
            size: blob.size,
            savingsPercent: savings,
          });
          setIsCompressing(false);
          triggerHaptic('heavy');
        },
        'image/jpeg',
        qualityValue
      );
    } catch (err) {
      console.error(err);
      setIsCompressing(false);
    }
  };

  const handleDownload = () => {
    if (!compressedResult || !selectedFile) return;

    triggerHaptic('heavy');
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#f97316', '#ef4444', '#f59e0b'],
    });

    const baseName = selectedFile.name.substring(0, selectedFile.name.lastIndexOf('.')) || 'image';
    const downloadName = `${baseName}_compressed.jpg`;

    const link = document.createElement('a');
    link.href = compressedResult.url;
    link.download = downloadName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    onAddToHistory({
      id: Date.now().toString(),
      toolId: 'image-compressor',
      toolName: 'ضاغط الصور الذكي',
      fileName: downloadName,
      fileSizeOriginal: selectedFile.size,
      fileSizeProcessed: compressedResult.size,
      timestamp: Date.now(),
      previewUrl: compressedResult.url,
      format: 'JPEG (COMPRESSED)',
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
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-red-600 p-0.5 flex items-center justify-center">
              <Minimize2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">ضاغط الصور الذكي</h2>
              <p className="text-xs text-slate-400">تقليل الحجم حتى 85% مع الحفاظ على الألوان والدقة</p>
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
            className="mt-5 border-2 border-dashed border-white/20 hover:border-amber-400/50 rounded-3xl p-8 text-center cursor-pointer bg-white/[0.02] hover:bg-white/[0.05] transition-all group"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <div className="w-14 h-14 rounded-2xl bg-white/[0.05] group-hover:bg-amber-500/10 text-slate-400 group-hover:text-amber-400 flex items-center justify-center mx-auto mb-3 transition-colors">
              <Upload className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-white mb-1">اختر صورة لتصغير حجمها</p>
            <p className="text-xs text-slate-400">يدعم كافة صيغ الصور ويوفر مساحة تخزين هائلة</p>
          </div>
        ) : (
          <div className="mt-5 space-y-4">
            {/* File Info Card */}
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={previewUrl || ''}
                  alt="Original"
                  className="w-14 h-14 rounded-xl object-cover border border-white/10"
                />
                <div>
                  <p className="text-sm font-semibold text-white truncate max-w-[200px]">{selectedFile.name}</p>
                  <p className="text-xs text-amber-400 font-mono">الحجم الحالي: {formatBytes(selectedFile.size)}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedFile(null);
                  setPreviewUrl(null);
                  setCompressedResult(null);
                }}
                className="text-xs text-slate-400 hover:text-rose-400 underline"
              >
                تغيير الصورة
              </button>
            </div>

            {/* Compression Preset Modes */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                اختر أسلوب الضغط:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'max', label: 'توفير أقصى 🚀', desc: 'أصغر حجم ممكن' },
                  { id: 'balanced', label: 'متوازن (موصى به)', desc: 'توازن دقيق بين الحجم والجودة' },
                  { id: 'high', label: 'جودة فائقة ✨', desc: 'ضغط خفيف وجودة سينمائية' },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => {
                      triggerHaptic('selection');
                      setCompressionMode(mode.id as any);
                      setCompressedResult(null);
                    }}
                    className={`p-3 rounded-2xl border text-right transition-all ${
                      compressionMode === mode.id
                        ? 'bg-amber-500/15 border-amber-500/50 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                        : 'bg-white/[0.03] border-white/[0.08] text-slate-400 hover:bg-white/[0.06]'
                    }`}
                  >
                    <div className="text-xs sm:text-sm font-bold text-white">{mode.label}</div>
                    <div className="text-[10px] text-slate-400 mt-1">{mode.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Resolution Scaling */}
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300">أبعاد الصورة (Resolution):</span>
                <span className="text-amber-400 font-mono font-bold">{Math.round(scaleFactor * 100)}%</span>
              </div>
              <div className="flex items-center gap-2">
                {[
                  { factor: 1.0, label: 'الأصلية 100%' },
                  { factor: 0.75, label: '75%' },
                  { factor: 0.5, label: 'نصف الحجم 50%' },
                ].map((scale) => (
                  <button
                    key={scale.factor}
                    type="button"
                    onClick={() => {
                      triggerHaptic('selection');
                      setScaleFactor(scale.factor);
                      setCompressedResult(null);
                    }}
                    className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold border transition-all ${
                      scaleFactor === scale.factor
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-white/[0.02] text-slate-400 border-white/[0.06]'
                    }`}
                  >
                    {scale.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Compress Button */}
            {!compressedResult ? (
              <button
                type="button"
                onClick={handleCompress}
                disabled={isCompressing}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-600 to-red-600 hover:from-amber-400 hover:to-red-500 text-white font-bold text-sm shadow-[0_4px_20px_rgba(249,115,22,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isCompressing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>جارِ الضغط بالمعالج الذكي...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>ضغط الصورة الآن</span>
                  </>
                )}
              </button>
            ) : (
              /* Success & Download */
              <div className="space-y-3 pt-2">
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 mb-1">
                      <TrendingDown className="w-4 h-4" />
                      <span>وفرت {compressedResult.savingsPercent}% من المساحة!</span>
                    </div>
                    <div className="text-xs text-slate-300">
                      قبل: <span className="font-mono text-slate-400">{formatBytes(selectedFile.size)}</span>
                      {' → '}
                      بعد: <span className="font-mono font-bold text-amber-300">{formatBytes(compressedResult.size)}</span>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-xl bg-amber-500/20 text-amber-300 text-xs font-mono font-bold">
                    -{formatBytes(selectedFile.size - compressedResult.size)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleDownload}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold text-sm shadow-[0_4px_20px_rgba(249,115,22,0.3)] transition-all flex items-center justify-center gap-2 active:scale-98"
                >
                  <Download className="w-4 h-4" />
                  <span>تحميل الصورة المضغوطة</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
