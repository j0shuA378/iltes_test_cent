import { ref } from 'vue';

export type AppTab = 
  | 'dashboard' 
  | 'reading' 
  | 'listening' 
  | 'writing' 
  | 'speaking' 
  | 'vocabulary' 
  | 'mistakes' 
  | 'settings';

export interface SelectedTestsState {
  reading?: string;
  listening?: string;
  writing?: string;
  speaking?: string;
}

const VALID_TABS: AppTab[] = [
  'dashboard',
  'reading',
  'listening',
  'writing',
  'speaking',
  'vocabulary',
  'mistakes',
  'settings'
];

/**
 * URL Hash Navigation Composable
 * Synchronizes application tabs and active tests with browser URL hash.
 * Enables:
 * - Direct URL bookmarking & sharing (e.g., /#/reading?id=cam18-t1-p1, /#/admin)
 * - Browser Back and Forward navigation
 * - Preserving current tab across page reloads
 */
const currentTab = ref<AppTab>('dashboard');
const isAdminMode = ref<boolean>(false);
const selectedTests = ref<SelectedTestsState>({});

export function useNavigation() {
  /**
   * Parse the current window.location.hash
   */
  const parseCurrentHash = () => {
    const fullHash = window.location.hash.replace(/^#\/?/, '').trim();
    const [pathPart, queryPart] = fullHash.split('?');

    // Admin detection
    if (pathPart === 'admin' || window.location.pathname.endsWith('/admin')) {
      isAdminMode.value = true;
      return;
    } else {
      isAdminMode.value = false;
    }

    // Tab detection
    const tabName = (pathPart.split('/')[0] || 'dashboard').toLowerCase() as AppTab;
    if (VALID_TABS.includes(tabName)) {
      currentTab.value = tabName;
    } else {
      currentTab.value = 'dashboard';
    }

    // Query parameters for selected test ID
    if (queryPart) {
      const searchParams = new URLSearchParams(queryPart);
      const testId = searchParams.get('id');
      if (testId && (tabName === 'reading' || tabName === 'listening' || tabName === 'writing' || tabName === 'speaking')) {
        selectedTests.value[tabName] = testId;
      }
    }
  };

  /**
   * Sync active tab state to URL hash
   */
  const updateHash = (tab: AppTab | 'admin', testId?: string) => {
    if (tab === 'admin') {
      window.location.hash = '#/admin';
      return;
    }

    let targetHash = `#/${tab}`;
    if (testId) {
      targetHash += `?id=${encodeURIComponent(testId)}`;
    }
    if (window.location.hash !== targetHash) {
      window.location.hash = targetHash;
    }
  };

  /**
   * Public navigation method
   */
  const navigateTo = (tab: AppTab, testId?: string) => {
    isAdminMode.value = false;
    currentTab.value = tab;
    if (testId && (tab === 'reading' || tab === 'listening' || tab === 'writing' || tab === 'speaking')) {
      selectedTests.value[tab] = testId;
    }
    updateHash(tab, testId);
  };

  const navigateToAdmin = () => {
    isAdminMode.value = true;
    updateHash('admin');
  };

  const returnToPortal = () => {
    isAdminMode.value = false;
    updateHash(currentTab.value);
  };

  const setupNavigationListeners = () => {
    parseCurrentHash();
    window.addEventListener('hashchange', parseCurrentHash);
    window.addEventListener('popstate', parseCurrentHash);
  };

  const cleanupNavigationListeners = () => {
    window.removeEventListener('hashchange', parseCurrentHash);
    window.removeEventListener('popstate', parseCurrentHash);
  };

  return {
    currentTab,
    isAdminMode,
    selectedTests,
    navigateTo,
    navigateToAdmin,
    returnToPortal,
    setupNavigationListeners,
    cleanupNavigationListeners
  };
}
