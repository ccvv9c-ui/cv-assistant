import React, { useState, useRef } from 'react';
import { X, Upload, FileText, Download, Trash2, ArrowUp, ArrowDown, Check, RefreshCw } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { triggerHaptic } from '../../utils/haptics';
import confetti from 'canvas-confetti';
import { ProcessedHistoryItem } from '../../types';

interface PdfCombinerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToHistory: (item: ProcessedHistoryItem) => void;
}

interface ImageFileItem {
  id: string;
  file: File;
  previewUrl: string;
}

export const PdfCombinerModal: React.FC<PdfCombinerModalProps> = ({
  isOpen,
  onClose,
  onAddToHistory,
}) => {
  const [images, setImages] = useState<ImageFileItem[]>([]);
  const [orientation, setOrientation] = useState<'p' | 'l'>('p');
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newItems: ImageFileItem[] = Array.from(e.target.files).map((file) => ({
        id: Math.random().toString(36).substring(7),
        file,
        previewUrl: URL.createObjectURL(file),
      }));
      setImages((prev) => [...prev, ...newItems]);
      triggerHaptic('light');
    }
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    triggerHaptic('selection');
    const newImages = [...images];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newImages.length) return;

    const temp = newImages[index];
    newImages[index] = newImages[targetIndex];
    newImages[targetIndex] = temp;
    setImages(newImages);
  };

  const handleRemove = (id: string) => {
    triggerHaptic('light');
    setImages(images.filter((img) => img.id !== id));
  };

  const handleGeneratePdf = async () => {
    if (images.length === 0) return;

    setIsGenerating(true);
    triggerHaptic('medium');

    try {
      const doc = new jsPDF({
        orientation: orientation,
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = orientation === 'p' ? 210 : 297;
      const pageHeight = orientation === 'p' ? 297 : 210;

      for (let i = 0; i < images.length; i++) {
        if (i > 0) doc.addPage();

        const item = images[i];
        const img = new Image();
        img.src = item.previewUrl;
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });

        // Compute aspect fit dimensions with 10mm margins
        const margin = 10;
        const maxW = pageWidth - margin * 2;
        const maxH = pageHeight - margin * 2;
        let renderW = maxW;
        let renderH = (img.height * renderW) / img.width;

        if (renderH > maxH) {
          renderH = maxH;
          renderW = (img.width * renderH) / img.height;
        }

        const posX = margin + (maxW - renderW) / 2;
        const posY = margin + (maxH - renderH) / 2;

        doc.addImage(img, 'JPEG', posX, posY, renderW, renderH);
      }

      const filename = `document_omnistudio_${Date.now()}.pdf`;
      doc.save(filename);

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#6366f1', '#a855f7', '#06b6d4'],
      });

      onAddToHistory({
        id: Date.now().toString(),
        toolId: 'pdf-combiner',
        toolName: 'مجمّع ملفات PDF',
        fileName: filename,
        fileSizeOriginal: images.reduce((acc, curr) => acc + curr.file.size, 0),
        fileSizeProcessed: 120000,
        timestamp: Date.now(),
        previewUrl: images[0]?.previewUrl,
        format: 'PDF',
      });

      setIsGenerating(false);
      triggerHaptic('heavy');
    } catch (err) {
      console.error(err);
      setIsGenerating(false);
    }
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
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-teal-500 p-0.5 flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">مجمّع ملفات PDF</h2>
              <p className="text-xs text-slate-400">دمج وترتيب الصور المتعددة في ملف PDF عالي الجودة</p>
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
        <div className="mt-5 space-y-4">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-white/20 hover:border-indigo-400/50 rounded-2xl p-5 text-center cursor-pointer bg-white/[0.02] hover:bg-white/[0.05] transition-all flex flex-col items-center justify-center"
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleFiles}
            />
            <div className="w-10 h-10 rounded-xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center mb-2">
              <Upload className="w-5 h-5" />
            </div>
            <p className="text-sm font-semibold text-white">اختر صوراً لدمجها في PDF</p>
            <p className="text-xs text-slate-400">يمكنك تحديد عدة صور معاً وإعادة ترتيب صفحاتها بحرية</p>
          </div>

          {/* Orientation settings */}
          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">اتجاه الصفحات (Orientation):</span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setOrientation('p')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  orientation === 'p'
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                عمودي (Portrait)
              </button>
              <button
                type="button"
                onClick={() => setOrientation('l')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  orientation === 'l'
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                أفقي (Landscape)
              </button>
            </div>
          </div>

          {/* Image List with Reordering */}
          {images.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>الصفحات ({images.length}):</span>
                <span>استخدم الأسهم للترتيب</span>
              </div>

              <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                {images.map((item, idx) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2 rounded-xl bg-white/[0.03] border border-white/[0.08]"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold font-mono text-cyan-400 w-5 text-center">
                        {idx + 1}
                      </span>
                      <img
                        src={item.previewUrl}
                        alt="Page"
                        className="w-10 h-10 rounded-lg object-cover border border-white/10"
                      />
                      <span className="text-xs text-slate-200 truncate max-w-[180px]">
                        {item.file.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleMove(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white disabled:opacity-30"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMove(idx, 'down')}
                        disabled={idx === images.length - 1}
                        className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white disabled:opacity-30"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemove(item.id)}
                        className="p-1 rounded-lg hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 ml-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Generate PDF Button */}
              <button
                type="button"
                onClick={handleGeneratePdf}
                disabled={isGenerating}
                className="w-full mt-3 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-teal-500 hover:from-indigo-500 hover:to-teal-400 text-white font-bold text-sm shadow-[0_4px_20px_rgba(99,102,241,0.3)] transition-all flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>جارِ تجميع صفحات PDF...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>تصدير وتحميل ملف PDF</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
