export type CategoryType = 'all' | 'image' | 'qr' | 'docs' | 'color';

export interface ToolItem {
  id: string;
  title: string;
  subtitle: string;
  category: CategoryType;
  categoryName: string;
  iconName: 'auto_fix_high' | 'compress' | 'qr_code_2' | 'palette_outlined' | 'picture_as_pdf_outlined' | 'security';
  gradient: string;
  accentColor: string;
  badge?: string;
  isPopular?: boolean;
}

export interface ProcessedHistoryItem {
  id: string;
  toolId: string;
  toolName: string;
  fileName: string;
  fileSizeOriginal: number;
  fileSizeProcessed: number;
  timestamp: number;
  previewUrl?: string;
  downloadUrl?: string;
  format?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: 'success' | 'info' | 'security';
}
