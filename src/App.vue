<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import AppSidebar from './components/Layout/AppSidebar.vue';
import AppHeader from './components/Layout/AppHeader.vue';
import AppTitleBar from './components/AppChrome/AppTitleBar.vue';
import AppStatusBar from './components/AppChrome/AppStatusBar.vue';
import ShortcutsModal from './components/AppChrome/ShortcutsModal.vue';
import AuthModal from './components/Auth/AuthModal.vue';
import PlacementTestModal from './components/Placement/PlacementTestModal.vue';
import DictionaryModal from './components/Dictionary/DictionaryModal.vue';
import FloatingDictionaryButton from './components/Dictionary/FloatingDictionaryButton.vue';
import QuestionBankSearchModal from './components/Search/QuestionBankSearchModal.vue';
import DashboardView from './components/Dashboard/DashboardView.vue';
import ReadingView from './components/Reading/ReadingView.vue';
import ListeningView from './components/Listening/ListeningView.vue';
import WritingView from './components/Writing/WritingView.vue';
import SpeakingView from './components/Speaking/SpeakingView.vue';
import VocabularyView from './components/Vocabulary/VocabularyView.vue';
import MistakesView from './components/Mistakes/MistakesView.vue';
import SettingsView from './components/Settings/SettingsView.vue';
import AdminView from './components/Admin/AdminView.vue';
import SmartRandomModal from './components/Common/SmartRandomModal.vue';
import { getUserProfile, getTestResults, getMistakes } from './services/storage';
import { getActiveUser } from './services/authService';
import { getDueEbbinghausItems } from './services/ebbinghausService';
import type { UserProfile, TestResult, ModuleType, RandomDrillConfig } from './types/ielts';
import type { UserAccount } from './types/auth';

const currentTab = ref<string>('dashboard');
const activeUser = ref<UserAccount>(getActiveUser());
const profile = ref<UserProfile>(getUserProfile());
const results = ref<TestResult[]>(getTestResults());
const mistakesCount = ref<number>(0);
const dueVocabCount = ref<number>(0);
const isAdminMode = ref<boolean>(false);
const isMobileMenuOpen = ref<boolean>(false);
const isSidebarCollapsed = ref<boolean>(localStorage.getItem('ielts_sidebar_collapsed') === 'true');

// Modals
const isAuthModalOpen = ref(false);
const isPlacementOpen = ref(false);
const isSearchOpen = ref(false);
const isDictionaryOpen = ref(false);
const isShortcutsOpen = ref(false);
const dictionaryWord = ref('');
const isSmartRandomOpen = ref(false);
const smartRandomModule = ref<ModuleType>('reading');

const handleToggleSidebar = () => {
  window.dispatchEvent(new CustomEvent('ielts_toggle_sidebar'));
  isSidebarCollapsed.value = !isSidebarCollapsed.value;
};

// Selected test IDs from Search or Randomizer
const selectedTests = ref<{
  reading?: string;
  listening?: string;
  writing?: string;
  speaking?: string;
}>({});

const handleOpenSmartRandom = (mod: ModuleType = 'reading') => {
  smartRandomModule.value = mod;
  isSmartRandomOpen.value = true;
};

const handleStartDrill = (config: RandomDrillConfig, targetTestId: string) => {
  if (config.module === 'reading') {
    selectedTests.value.reading = targetTestId;
    currentTab.value = 'reading';
  } else if (config.module === 'listening') {
    selectedTests.value.listening = targetTestId;
    currentTab.value = 'listening';
  } else if (config.module === 'writing') {
    selectedTests.value.writing = targetTestId;
    currentTab.value = 'writing';
  } else if (config.module === 'speaking') {
    selectedTests.value.speaking = targetTestId;
    currentTab.value = 'speaking';
  }
  isSmartRandomOpen.value = false;
};

const refreshUserData = () => {
  activeUser.value = getActiveUser();
  profile.value = getUserProfile();
  results.value = getTestResults();
  const m = getMistakes();
  mistakesCount.value = m.filter(item => !item.isResolved).length;
  dueVocabCount.value = getDueEbbinghausItems('vocab').length;
};

const handleAuthChange = () => {
  refreshUserData();
};

const handleEbbinghausChange = () => {
  dueVocabCount.value = getDueEbbinghausItems('vocab').length;
};

const checkAdminRoute = () => {
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  return path.endsWith('/admin') || path.endsWith('/admin/') || hash === '#/admin' || hash === '#admin';
};

const handleHashOrPopState = () => {
  isAdminMode.value = checkAdminRoute();
};

const navigateToAdmin = () => {
  isAdminMode.value = true;
  isMobileMenuOpen.value = false;
  if (!window.location.hash.includes('admin')) {
    window.location.hash = '#/admin';
  }
};

const handleReturnToPortal = () => {
  isAdminMode.value = false;
  if (window.location.hash.includes('admin')) {
    history.replaceState(null, '', window.location.pathname);
  }
};

const handleKeyDown = (e: KeyboardEvent) => {
  const target = e.target as HTMLElement;
  const isInput = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);

  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    isSearchOpen.value = true;
  } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
    e.preventDefault();
    isDictionaryOpen.value = true;
  } else if (((e.ctrlKey || e.metaKey) && e.key === '/') || e.key === 'F1') {
    e.preventDefault();
    isShortcutsOpen.value = true;
  } else if (!isInput && e.key >= '1' && e.key <= '7' && !e.ctrlKey && !e.altKey && !e.metaKey) {
    const tabs = ['dashboard', 'reading', 'listening', 'writing', 'speaking', 'vocabulary', 'mistakes'];
    const idx = parseInt(e.key) - 1;
    if (tabs[idx]) {
      currentTab.value = tabs[idx];
    }
  }
};

onMounted(() => {
  refreshUserData();
  isAdminMode.value = checkAdminRoute();
  window.addEventListener('ielts_auth_changed', handleAuthChange);
  window.addEventListener('ielts_ebbinghaus_updated', handleEbbinghausChange);
  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('hashchange', handleHashOrPopState);
  window.addEventListener('popstate', handleHashOrPopState);
});

onUnmounted(() => {
  window.removeEventListener('ielts_auth_changed', handleAuthChange);
  window.removeEventListener('ielts_ebbinghaus_updated', handleEbbinghausChange);
  window.removeEventListener('keydown', handleKeyDown);
  window.removeEventListener('hashchange', handleHashOrPopState);
  window.removeEventListener('popstate', handleHashOrPopState);
});

const handleSelectTestFromSearch = (module: string, testId: string) => {
  selectedTests.value = {
    ...selectedTests.value,
    [module]: testId
  };
  currentTab.value = module;
  isSearchOpen.value = false;
};

const handleOpenDictionary = (word?: string) => {
  dictionaryWord.value = word || '';
  isDictionaryOpen.value = true;
};

const remainingDays = computed(() => {
  const examDate = new Date(profile.value.examDate);
  return Math.max(0, Math.ceil((examDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
});
</script>

<template>
  <!-- ADMIN MANAGEMENT PORTAL (/admin) -->
  <AdminView 
    v-if="isAdminMode" 
    @returnToPortal="handleReturnToPortal" 
  />

  <!-- STUDENT EXAM PORTAL (DEFAULT) -->
  <div v-else class="flex flex-col h-screen w-screen overflow-hidden bg-[#f5f5f7] font-sans selection:bg-[#1d1d1f] selection:text-white relative">
    <!-- Desktop Native Application TitleBar (macOS Traffic Light Dots & Controls) -->
    <AppTitleBar 
      :currentTab="currentTab"
      :activeUser="activeUser"
      :isSidebarCollapsed="isSidebarCollapsed"
      @navigate="currentTab = $event"
      @toggleSidebar="handleToggleSidebar"
      @openSearch="isSearchOpen = true"
      @openDictionary="handleOpenDictionary()"
      @openShortcuts="isShortcutsOpen = true"
      @openAuthModal="isAuthModalOpen = true"
      @openPlacementTest="isPlacementOpen = true"
    />

    <!-- Middle Split: Left Sidebar & Right Workspace -->
    <div class="flex flex-1 min-h-0 overflow-hidden relative">
      <!-- Left Application Portal Sidebar -->
      <AppSidebar 
        :currentTab="currentTab"
        :activeUser="activeUser"
        :dueVocabCount="dueVocabCount"
        :mistakesCount="mistakesCount"
        :isMobileOpen="isMobileMenuOpen"
        @selectTab="currentTab = $event"
        @openAuthModal="isAuthModalOpen = true"
        @openAdmin="navigateToAdmin"
        @closeMobile="isMobileMenuOpen = false"
      />

      <!-- Main Right Application Window -->
      <div class="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        <!-- Top Header Command Bar -->
        <AppHeader 
          :activeUser="activeUser"
          :dueVocabCount="dueVocabCount"
          :remainingDays="remainingDays"
          @openSearch="isSearchOpen = true"
          @openDictionary="handleOpenDictionary()"
          @openAuthModal="isAuthModalOpen = true"
          @navigateTab="currentTab = $event"
          @openPlacementTest="isPlacementOpen = true"
          @toggleMobileMenu="isMobileMenuOpen = !isMobileMenuOpen"
          @openAdmin="navigateToAdmin"
        />

        <!-- Scrollable Workspace Content View -->
        <div class="flex-1 overflow-y-auto">
          <main class="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <DashboardView 
              v-if="currentTab === 'dashboard'"
              :key="'dash_' + activeUser.id"
              :profile="profile" 
              :results="results" 
              :mistakesCount="mistakesCount"
              :activeUser="activeUser"
              @navigate="currentTab = $event"
              @openPlacementTest="isPlacementOpen = true"
              @openSmartRandom="handleOpenSmartRandom"
            />

            <ReadingView 
              v-else-if="currentTab === 'reading'"
              :key="'read_' + activeUser.id"
              :selectedTestId="selectedTests.reading"
              @refreshMistakes="refreshUserData" 
              @openSearch="isSearchOpen = true"
              @openDictionary="handleOpenDictionary"
              @openSmartRandom="handleOpenSmartRandom"
            />

            <ListeningView 
              v-else-if="currentTab === 'listening'"
              :key="'list_' + activeUser.id"
              :selectedTestId="selectedTests.listening"
              @refreshMistakes="refreshUserData" 
              @openSearch="isSearchOpen = true"
              @openDictionary="handleOpenDictionary"
              @openSmartRandom="handleOpenSmartRandom"
            />

            <WritingView 
              v-else-if="currentTab === 'writing'"
              :key="'writ_' + activeUser.id"
              :profile="profile" 
              :selectedTaskId="selectedTests.writing"
              @openSearch="isSearchOpen = true"
              @openSmartRandom="handleOpenSmartRandom"
            />

            <SpeakingView 
              v-else-if="currentTab === 'speaking'"
              :key="'spk_' + activeUser.id"
              :selectedTopicId="selectedTests.speaking"
              @openSearch="isSearchOpen = true"
              @openSmartRandom="handleOpenSmartRandom"
            />

            <VocabularyView 
              v-else-if="currentTab === 'vocabulary'"
              :key="'voc_' + activeUser.id"
            />

            <MistakesView 
              v-else-if="currentTab === 'mistakes'"
              :key="'mst_' + activeUser.id"
              @refreshMistakes="refreshUserData" 
            />

            <SettingsView 
              v-else-if="currentTab === 'settings'"
              :key="'set_' + activeUser.id"
              :profile="profile" 
              @updateProfile="(updated) => {
                profile = updated;
                refreshUserData();
              }" 
              @openAdmin="navigateToAdmin"
              @openAuthModal="isAuthModalOpen = true"
            />
          </main>

          <!-- Global Footer (Apple Minimalist Style) -->
          <footer class="bg-[#f5f5f7] border-t border-black/[0.06] py-6 text-center text-xs text-[#86868b] mt-12">
            <div class="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2.5">
              <div class="flex items-center gap-2">
                <span class="font-semibold text-[#1d1d1f]">IELTS Master Portal</span>
                <span>· 雅思全真机考与艾宾浩斯抗遗忘记忆系统</span>
              </div>
              <div class="flex items-center gap-3">
                <button
                  @click="handleOpenDictionary()"
                  class="text-[#0071e3] hover:underline font-medium cursor-pointer"
                >
                  即时学术词典 (Ctrl+D)
                </button>
                <span class="text-black/10">·</span>
                <button
                  @click="isSearchOpen = true"
                  class="text-[#0071e3] hover:underline font-medium cursor-pointer"
                >
                  题库搜寻中心 (Ctrl+K)
                </button>
                <span class="text-black/10">·</span>
                <button
                  @click="navigateToAdmin()"
                  class="text-[#86868b] hover:text-[#1d1d1f] hover:underline font-medium cursor-pointer"
                >
                  管理控制台 (/admin)
                </button>
                <span class="text-black/10">·</span>
                <span>当前学员: <strong class="text-[#1d1d1f] font-medium">{{ activeUser.displayName }}</strong></span>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>

    <!-- Bottom Desktop Application Status Bar -->
    <AppStatusBar 
      :activeUser="activeUser"
      @openShortcuts="isShortcutsOpen = true"
      @openAdmin="navigateToAdmin"
      @openAuthModal="isAuthModalOpen = true"
      @openDictionary="handleOpenDictionary()"
    />

    <!-- Floating Quick Dictionary Trigger Button -->
    <FloatingDictionaryButton @click="handleOpenDictionary()" />

    <!-- Global Question Bank Search Modal -->
    <QuestionBankSearchModal
      :isOpen="isSearchOpen"
      @close="isSearchOpen = false"
      @selectTest="handleSelectTestFromSearch"
    />

    <!-- Global Instant Dictionary Modal -->
    <DictionaryModal
      :isOpen="isDictionaryOpen"
      :initialQuery="dictionaryWord"
      @close="isDictionaryOpen = false"
    />

    <!-- Multi-User Registration & Account Switching Modal -->
    <AuthModal 
      :isOpen="isAuthModalOpen"
      @close="isAuthModalOpen = false"
      @userSwitched="refreshUserData"
      @userRegistered="() => {
        refreshUserData();
        isPlacementOpen = true;
      }"
    />

    <!-- 3-Minute Academic Placement Diagnostic Test Modal -->
    <PlacementTestModal
      :isOpen="isPlacementOpen"
      :activeUser="activeUser"
      @close="isPlacementOpen = false"
      @completed="() => {
        refreshUserData();
      }"
    />

    <!-- Global Smart Random Drill Modal -->
    <SmartRandomModal
      :isOpen="isSmartRandomOpen"
      :initialModule="smartRandomModule"
      @close="isSmartRandomOpen = false"
      @startDrill="handleStartDrill"
    />

    <!-- Global Keyboard Shortcuts Modal -->
    <ShortcutsModal 
      :isOpen="isShortcutsOpen" 
      @close="isShortcutsOpen = false" 
    />
  </div>
</template>
