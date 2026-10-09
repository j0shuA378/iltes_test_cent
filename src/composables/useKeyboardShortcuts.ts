import { onMounted, onUnmounted } from 'vue';
import type { AppTab } from './useNavigation';

export interface ShortcutHandlers {
  onSearch: () => void;
  onDictionary: () => void;
  onShortcuts: () => void;
  onSwitchTab: (tab: AppTab) => void;
}

const TAB_INDEX_MAP: AppTab[] = [
  'dashboard',
  'reading',
  'listening',
  'writing',
  'speaking',
  'vocabulary',
  'mistakes'
];

/**
 * Global Keyboard Shortcuts Composable
 * Handles Ctrl+K, Ctrl+D, Ctrl+/, and number keys 1-7
 */
export function useKeyboardShortcuts(handlers: ShortcutHandlers) {
  const handleKeyDown = (e: KeyboardEvent) => {
    const target = e.target as HTMLElement;
    const isInput = target && (
      target.tagName === 'INPUT' || 
      target.tagName === 'TEXTAREA' || 
      target.isContentEditable
    );

    // Ctrl+K / Cmd+K: Search Question Bank
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      handlers.onSearch();
      return;
    }

    // Ctrl+D / Cmd+D: Academic Dictionary
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
      e.preventDefault();
      handlers.onDictionary();
      return;
    }

    // Ctrl+/ or F1: Keyboard Shortcuts Cheatsheet
    if (((e.ctrlKey || e.metaKey) && e.key === '/') || e.key === 'F1') {
      e.preventDefault();
      handlers.onShortcuts();
      return;
    }

    // Number keys 1-7 (when not typing in an input field)
    if (!isInput && e.key >= '1' && e.key <= '7' && !e.ctrlKey && !e.altKey && !e.metaKey) {
      const index = parseInt(e.key, 10) - 1;
      const targetTab = TAB_INDEX_MAP[index];
      if (targetTab) {
        e.preventDefault();
        handlers.onSwitchTab(targetTab);
      }
    }
  };

  onMounted(() => {
    window.addEventListener('keydown', handleKeyDown);
  });

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown);
  });
}
