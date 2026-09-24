/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { BackgroundMesh } from './components/BackgroundMesh';
import { HomeHeader } from './components/HomeHeader';
import { SearchBarWidget } from './components/SearchBarWidget';
import { CategoryFilter } from './components/CategoryFilter';
import { FeaturedCarousel } from './components/FeaturedCarousel';
import { ToolCard } from './components/ToolCard';
import { QuickStatsBar } from './components/QuickStatsBar';
import { BottomNavBar, NavTab } from './components/BottomNavBar';
import { EmptySearchState } from './components/EmptySearchState';
import { HistoryView } from './components/HistoryView';
import { NotificationModal } from './components/NotificationModal';
import { SettingsModal } from './components/SettingsModal';

// Interactive Tool Modals
import { ImageConverterModal } from './components/tools/ImageConverterModal';
import { ImageCompressorModal } from './components/tools/ImageCompressorModal';
import { QRCodeStudioModal } from './components/tools/QRCodeStudioModal';
import { ColorExtractorModal } from './components/tools/ColorExtractorModal';
import { PdfCombinerModal } from './components/tools/PdfCombinerModal';
import { ExifCleanerModal } from './components/tools/ExifCleanerModal';

import { TOOLS_DATA } from './data/toolsData';
import { CategoryType, ToolItem, ProcessedHistoryItem, AppNotification } from './types';
import { triggerHaptic } from './utils/haptics';

export default function App() {
  // Navigation & Tabs
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [activeCategory, setActiveCategory] = useState<CategoryType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // User Profile (Supabase Session representation)
  const [userName, setUserName] = useState('حسام مرضي');
  const [userEmail, setUserEmail] = useState('hosanmarzi@gmail.com');

  // Modals & Panels
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeToolModal, setActiveToolModal] = useState<string | null>(null);

  // History & Notifications Data with Local Storage persistence
  const [history, setHistory] = useState<ProcessedHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('omni_history');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [
      {
        id: 'init-1',
        toolId: 'image-converter',
        toolName: 'محول صيغ الصور',
        fileName: 'nature_banner_omnistudio.webp',
        fileSizeOriginal: 3450000,
        fileSizeProcessed: 520000,
        timestamp: Date.now() - 3600000,
        format: 'WEBP',
      },
      {
        id: 'init-2',
        toolId: 'image-compressor',
        toolName: 'ضاغط الصور الذكي',
        fileName: 'profile_shot_compressed.jpg',
        fileSizeOriginal: 2100000,
        fileSizeProcessed: 430000,
        timestamp: Date.now() - 7200000,
        format: 'JPEG',
      },
    ];
  });

  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'n-1',
      title: 'محرك المعالجة المحلي نشط',
      message: 'تم تفعيل معالجة الصور ورموز QR محلياً بنسبة 100% داخل المتصفح وبدون إنترنت.',
      timestamp: 'منذ قليل',
      isRead: false,
      type: 'security',
    },
    {
      id: 'n-2',
      title: 'تحديث بيئة الأدوات v3.2',
      message: 'تمت إضافة مجمّع ملفات PDF وتحديث واجهة Material 3 Expressive بنجاح.',
      timestamp: 'اليوم',
      isRead: false,
      type: 'info',
    },
  ]);

  // Persist history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('omni_history', JSON.stringify(history));
    } catch {
      // ignore
    }
  }, [history]);

  // Add Item to History
  const handleAddToHistory = (item: ProcessedHistoryItem) => {
    setHistory((prev) => [item, ...prev]);

    // Add success notification
    const newNotif: AppNotification = {
      id: Date.now().toString(),
      title: `تم إنجاز العملية في: ${item.toolName}`,
      message: `تم تجهيز الملف ${item.fileName} بنجاح وحفظه محلياً.`,
      timestamp: 'الآن',
      isRead: false,
      type: 'success',
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Filtered Tools based on Search Query and Category
  const filteredTools = useMemo(() => {
    return TOOLS_DATA.filter((tool) => {
      const matchesCategory = activeCategory === 'all' || tool.category === activeCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        tool.title.toLowerCase().includes(q) ||
        tool.subtitle.toLowerCase().includes(q) ||
        tool.categoryName.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  // Tool Counts per Category
  const toolCounts = useMemo(() => {
    const counts: Record<CategoryType, number> = {
      all: TOOLS_DATA.length,
      image: 0,
      qr: 0,
      docs: 0,
      color: 0,
    };
    TOOLS_DATA.forEach((tool) => {
      if (counts[tool.category] !== undefined) {
        counts[tool.category]++;
      }
    });
    return counts;
  }, []);

  const unreadNotifsCount = notifications.filter((n) => !n.isRead).length;

  const totalSavedSpace = useMemo(() => {
    return history.reduce((acc, curr) => {
      return acc + Math.max(0, curr.fileSizeOriginal - curr.fileSizeProcessed);
    }, 0);
  }, [history]);

  const handleOpenTool = (toolId: string) => {
    triggerHaptic('medium');
    setActiveToolModal(toolId);
  };

  return (
    <div className="min-h-screen bg-[#080c16] text-slate-100 flex flex-col relative selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* GPU-Accelerated Dynamic Animated Neon Gradient Mesh */}
      <BackgroundMesh />

      {/* Custom Top Bar (Header) */}
      <HomeHeader
        userName={userName}
        userEmail={userEmail}
        unreadCount={unreadNotifsCount}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 z-10">
        {activeTab === 'home' && (
          <div className="space-y-6 pb-28">
            {/* Dynamic Search & Quick Filter Bar */}
            <div className="space-y-3">
              <SearchBarWidget
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                resultCount={filteredTools.length}
                totalCount={TOOLS_DATA.length}
              />
              <CategoryFilter
                activeCategory={activeCategory}
                onSelectCategory={setActiveCategory}
                toolCounts={toolCounts}
              />
            </div>

            {/* Featured / Recent Activity Banner (Carousel) - Shown when not searching */}
            {!searchQuery && (
              <FeaturedCarousel
                onQuickAction={handleOpenTool}
                recentProcessedCount={history.length}
              />
            )}

            {/* Tools Grid (Core Feature) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-right">
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                    أدوات المعالجة المتاحة
                  </h2>
                  <span className="text-xs text-slate-500 font-mono">
                    ({filteredTools.length})
                  </span>
                </div>
                <span className="text-xs text-cyan-400 font-medium hidden sm:inline">
                  اضغط على أي بطاقة لبدء الاستخدام الفوري
                </span>
              </div>

              {/* 2-column staggered responsive grid of interactive tool cards */}
              {filteredTools.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
                  {filteredTools.map((tool, idx) => (
                    <ToolCard
                      key={tool.id}
                      tool={tool}
                      index={idx}
                      onSelect={(t) => handleOpenTool(t.id)}
                    />
                  ))}
                </div>
              ) : (
                <EmptySearchState
                  searchQuery={searchQuery}
                  onClear={() => setSearchQuery('')}
                  onSuggest={(term) => setSearchQuery(term)}
                />
              )}
            </div>

            {/* Quick Stats / Storage Bar (Bottom Sheet widget) */}
            <QuickStatsBar
              processedCount={history.length}
              savedSpaceBytes={totalSavedSpace}
            />
          </div>
        )}

        {/* Tab 2: Saved / History View */}
        {activeTab === 'history' && (
          <HistoryView
            history={history}
            onBackToHome={() => setActiveTab('home')}
            onClearHistory={() => setHistory([])}
          />
        )}

        {/* Tab 3: Settings View */}
        {activeTab === 'settings' && (
          <div className="w-full max-w-2xl mx-auto space-y-4 pb-28 text-right" dir="rtl">
            <h2 className="text-xl font-bold text-white">إعدادات المنصة</h2>
            <div className="p-5 rounded-3xl glass-card border border-white/[0.08] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                <div>
                  <span className="text-sm font-bold text-white">المستخدم المسجل</span>
                  <p className="text-xs text-slate-400 font-sans" dir="ltr">{userEmail}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSettingsOpen(true)}
                  className="px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-semibold"
                >
                  تعديل الملف الشخصي
                </button>
              </div>

              <div className="text-xs text-slate-300 space-y-2">
                <p className="font-semibold text-white">عن بيئة الأدوات (OmniMedia Studio):</p>
                <p className="text-slate-400 leading-relaxed">
                  تطبيق متكامل مبني ليعمل مباشرة داخل المتصفح بأقصى سرعة ممكنة وبأعلى درجات الخصوصية. جميع الأدوات من محول صيغ وضاغط الصور واستوديو رموز QR ومستخرج الألوان ومجمّع PDF تعمل معالجة في الواجهة الأمامية دون إرسال أي صورة إلى مخدمات خارجية.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Floating Modern Bottom Navigation Bar */}
      <BottomNavBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        savedCount={history.length}
      />

      {/* Functional Tool Modals */}
      <ImageConverterModal
        isOpen={activeToolModal === 'image-converter'}
        onClose={() => setActiveToolModal(null)}
        onAddToHistory={handleAddToHistory}
      />

      <ImageCompressorModal
        isOpen={activeToolModal === 'image-compressor'}
        onClose={() => setActiveToolModal(null)}
        onAddToHistory={handleAddToHistory}
      />

      <QRCodeStudioModal
        isOpen={activeToolModal === 'qr-studio'}
        onClose={() => setActiveToolModal(null)}
        onAddToHistory={handleAddToHistory}
      />

      <ColorExtractorModal
        isOpen={activeToolModal === 'color-extractor'}
        onClose={() => setActiveToolModal(null)}
        onAddToHistory={handleAddToHistory}
      />

      <PdfCombinerModal
        isOpen={activeToolModal === 'pdf-combiner'}
        onClose={() => setActiveToolModal(null)}
        onAddToHistory={handleAddToHistory}
      />

      <ExifCleanerModal
        isOpen={activeToolModal === 'exif-cleaner'}
        onClose={() => setActiveToolModal(null)}
        onAddToHistory={handleAddToHistory}
      />

      {/* Notifications Drawer/Modal */}
      <NotificationModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onClearAll={() => setNotifications([])}
        onMarkRead={(id) => {
          setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
          );
        }}
      />

      {/* Settings & Profile Drawer/Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        userName={userName}
        userEmail={userEmail}
        onUpdateProfile={(name, email) => {
          setUserName(name);
          setUserEmail(email);
        }}
        onClearData={() => {
          setHistory([]);
          localStorage.removeItem('omni_history');
        }}
      />
    </div>
  );
}
