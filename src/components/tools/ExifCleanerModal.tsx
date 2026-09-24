import React, { useState, useRef } from 'react';
import { X, Upload, ShieldCheck, Download, Check, RefreshCw, EyeOff, MapPin, Camera, Calendar } from 'lucide-react';
import { triggerHaptic, formatBytes } from '../../utils/haptics';
import confetti from 'canvas-confetti';
import { ProcessedHistoryItem } from '../../types';

interface ExifCleanerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToHistory: (item: ProcessedHistoryItem) => void;
}

export const ExifCleanerModal: React.FC<ExifCleanerModalProps> = ({
  isOpen,
  onClose,
  onAddToHistory,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isCleaning, setIsCleaning] = useState(false);
  const [cleanedResult, setCleanedResult] = useState<{
    blob: Blob;
    url: string;
    size: number;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setCleanedResult(null);
      triggerHaptic('light');
    }
  };

  const handleClean = async () => {
    if (!selectedFile || !previewUrl) return;

    setIsCleaning(true);
    triggerHaptic('medium');

    try {
      const img = new Image();
      img.src = previewUrl;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      // Canvas strips 100% of EXIF, GPS, camera metadata, author tags
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');

      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            setIsCleaning(false);
            return;
          }

          const url = URL.createObjectURL(blob);
          setCleanedResult({
            blob,
            url,
            size: blob.size,
          });
          setIsCleaning(false);
          triggerHaptic('heavy');
        },
        'image/jpeg',
        0.92
      );
    } catch (err) {
      console.error(err);
      setIsCleaning(false);
    }
  };

  const handleDownload = () => {
    if (!cleanedResult || !selectedFile) return;

    triggerHaptic('heavy');
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#10b981', '#84cc16', '#06b6d4'],
    });

    const baseName = selectedFile.name.substring(0, selectedFile.name.lastIndexOf('.')) || 'image';
    const downloadName = `${baseName}_sanitized_clean.jpg`;

    const link = document.createElement('a');
    link.href = cleanedResult.url;
    link.download = downloadName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    onAddToHistory({
      id: Date.now().toString(),
      toolId: 'exif-cleaner',
      toolName: 'منظف بيانات EXIF',
      fileName: downloadName,
      fileSizeOriginal: selectedFile.size,
      fileSizeProcessed: cleanedResult.size,
      timestamp: Date.now(),
      previewUrl: cleanedResult.url,
      format: 'CLEAN JPEG',
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
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-lime-500 p-0.5 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">منظف بيانات EXIF وحارس الخصوصية</h2>
              <p className="text-xs text-slate-400">مسح إحداثيات الموقع وتفاصيل الكاميرا وتاريخ الالتقاط</p>
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
            className="mt-5 border-2 border-dashed border-white/20 hover:border-lime-400/50 rounded-3xl p-8 text-center cursor-pointer bg-white/[0.02] hover:bg-white/[0.05] transition-all group"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <div className="w-14 h-14 rounded-2xl bg-white/[0.05] group-hover:bg-lime-500/10 text-slate-400 group-hover:text-lime-400 flex items-center justify-center mx-auto mb-3 transition-colors">
              <EyeOff className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-white mb-1">اختر صورة لمسح بياناتها السرية</p>
            <p className="text-xs text-slate-400">سيتم تجريد إحداثيات GPS ونوع الهاتف بدون التأثير على جودة الصورة</p>
          </div>
        ) : (
          <div className="mt-5 space-y-4">
            {/* Image Preview & Current Detected Privacy Risks */}
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={previewUrl || ''}
                  alt="Original"
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
                  setCleanedResult(null);
                }}
                className="text-xs text-slate-400 hover:text-rose-400 underline"
              >
                تغيير الصورة
              </button>
            </div>

            {/* Privacy Inspection Card */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-2.5">
              <span className="text-xs font-semibold text-slate-300 block">
                البيانات الحساسة التي سيتم تجريدها ومسحها نهائياً:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-center gap-2">
                  <MapPin className="w-4 h-4 shrink-0" />
                  <span>إحداثيات GPS والموقع الجغرافي</span>
                </div>
                <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-center gap-2">
                  <Camera className="w-4 h-4 shrink-0" />
                  <span>طراز الكاميرا والهاتف والعدسة</span>
                </div>
                <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-center gap-2">
                  <Calendar className="w-4 h-4 shrink-0" />
                  <span>تاريخ ووقت وتوقيت الالتقاط</span>
                </div>
              </div>
            </div>

            {/* Clean Trigger */}
            {!cleanedResult ? (
              <button
                type="button"
                onClick={handleClean}
                disabled={isCleaning}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-green-600 to-lime-500 hover:from-emerald-500 hover:to-lime-400 text-white font-bold text-sm shadow-[0_4px_20px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isCleaning ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>جارِ مسح بيانات التتبع والموقع...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>مسح بيانات EXIF وتأمين الصورة</span>
                  </>
                )}
              </button>
            ) : (
              /* Success & Download */
              <div className="space-y-3 pt-2">
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 mb-1">
                      <Check className="w-4 h-4" />
                      <span>تم تنظيف الصورة بنجاح وتجريد كافة بيانات الميتا!</span>
                    </div>
                    <div className="text-xs text-slate-300">
                      الصورة الآن آمنة تماماً للمشاركة على وسائل التواصل والإنترنت
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleDownload}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-sm shadow-[0_4px_20px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-2 active:scale-98"
                >
                  <Download className="w-4 h-4" />
                  <span>تحميل الصورة المنظفة والآمنة</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
