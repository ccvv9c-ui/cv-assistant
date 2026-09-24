// Simple haptic feedback utility
export function triggerHaptic(type: 'light' | 'medium' | 'heavy' | 'selection' = 'light') {
  if (typeof window !== 'undefined' && 'vibrate' in navigator) {
    try {
      switch (type) {
        case 'light':
          navigator.vibrate(10);
          break;
        case 'medium':
          navigator.vibrate(25);
          break;
        case 'heavy':
          navigator.vibrate([40, 20, 40]);
          break;
        case 'selection':
          navigator.vibrate(5);
          break;
      }
    } catch {
      // Ignore vibration errors if restricted by browser
    }
  }
}

export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 بايت';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['بايت', 'ك.ب', 'م.ب', 'ج.ب'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
