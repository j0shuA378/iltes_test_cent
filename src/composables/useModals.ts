import { ref } from 'vue';
import type { ModuleType } from '../types/ielts';

/**
 * Global Modals Manager Composable
 * Centralizes UI modal visibility state and actions, decoupling App.vue.
 */
const isAuthModalOpen = ref(false);
const isPlacementOpen = ref(false);
const isSearchOpen = ref(false);
const isDictionaryOpen = ref(false);
const isShortcutsOpen = ref(false);
const dictionaryWord = ref('');
const isSmartRandomOpen = ref(false);
const smartRandomModule = ref<ModuleType>('reading');

export function useModals() {
  const openAuth = () => {
    isAuthModalOpen.value = true;
  };

  const closeAuth = () => {
    isAuthModalOpen.value = false;
  };

  const openSearch = () => {
    isSearchOpen.value = true;
  };

  const closeSearch = () => {
    isSearchOpen.value = false;
  };

  const openDictionary = (word: string = '') => {
    dictionaryWord.value = word;
    isDictionaryOpen.value = true;
  };

  const closeDictionary = () => {
    isDictionaryOpen.value = false;
    dictionaryWord.value = '';
  };

  const openShortcuts = () => {
    isShortcutsOpen.value = true;
  };

  const closeShortcuts = () => {
    isShortcutsOpen.value = false;
  };

  const openPlacement = () => {
    isPlacementOpen.value = true;
  };

  const closePlacement = () => {
    isPlacementOpen.value = false;
  };

  const openSmartRandom = (mod: ModuleType = 'reading') => {
    smartRandomModule.value = mod;
    isSmartRandomOpen.value = true;
  };

  const closeSmartRandom = () => {
    isSmartRandomOpen.value = false;
  };

  return {
    isAuthModalOpen,
    isPlacementOpen,
    isSearchOpen,
    isDictionaryOpen,
    isShortcutsOpen,
    dictionaryWord,
    isSmartRandomOpen,
    smartRandomModule,
    openAuth,
    closeAuth,
    openSearch,
    closeSearch,
    openDictionary,
    closeDictionary,
    openShortcuts,
    closeShortcuts,
    openPlacement,
    closePlacement,
    openSmartRandom,
    closeSmartRandom
  };
}
