<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, defineAsyncComponent } from 'vue';
import AppSidebar from './components/Layout/AppSidebar.vue';
import AppHeader from './components/Layout/AppHeader.vue';
import AppTitleBar from './components/AppChrome/AppTitleBar.vue';
import AppStatusBar from './components/AppChrome/AppStatusBar.vue';
import DashboardView from './components/Dashboard/DashboardView.vue';
import FloatingDictionaryButton from './components/Dictionary/FloatingDictionaryButton.vue';

// Async Views (Phase 2 & 3: Code splitting and on-demand chunk loading)
const ReadingView = defineAsyncComponent(() => import('./components/Reading/ReadingView.vue'));
const ListeningView = defineAsyncComponent(() => import('./components/Listening/ListeningView.vue'));
const WritingView = defineAsyncComponent(() => import('./components/Writing/WritingView.vue'));
const SpeakingView = defineAsyncComponent(() => import('./components/Speaking/SpeakingView.vue'));
const VocabularyView = defineAsyncComponent(() => import('./components/Vocabulary/VocabularyView.vue'));
const MistakesView = defineAsyncComponent(() => import('./components/Mistakes/MistakesView.vue'));
const SettingsView = defineAsyncComponent(() => import('./components/Settings/SettingsView.vue'));
const AdminView = defineAsyncComponent(() => import('./components/Admin/AdminView.vue'));

// Async Modals (Lazy-loaded upon trigger)
const ShortcutsModal = defineAsyncComponent(() => import('./components/AppChrome/ShortcutsModal.vue'));
const AuthModal = defineAsyncComponent(() => import('./components/Auth/AuthModal.vue'));
const PlacementTestModal = defineAsyncComponent(() => import('./components/Placement/PlacementTestModal.vue'));
const DictionaryModal = defineAsyncComponent(() => import('./components/Dictionary/DictionaryModal.vue'));
const QuestionBankSearchModal = defineAsyncComponent(() => import('./components/Search/QuestionBankSearchModal.vue'));
const SmartRandomModal = defineAsyncComponent(() => import('./components/Common/SmartRandomModal.vue'));
const GoalSettingModal = defineAsyncComponent(() => import('./components/Onboarding/GoalSettingModal.vue'));

// Services & Composables
import { getUserProfile, getTestResults, getMistakes } from './services/storage';
import { getActiveUser } from './services/authService';
import { getDueEbbinghausItems } from './services/ebbinghausService';
import { useNavigation, type AppTab } from './composables/useNavigation';
import { useModals } from './composables/useModals';
import { useKeyboardShortcuts } from './composables/useKeyboardShortcuts';
import type { UserProfile, TestResult, ModuleType, RandomDrillConfig } from './types/ielts';
import type { UserAccount } from './types/auth';

// Navigation Composable (URL Hash routing + History + Test selection)
const {
  currentTab,
  isAdminMode,
  selectedTests,
  navigateTo,
  navigateToAdmin,
  returnToPortal,
  setupNavigationListeners,
  cleanupNavigationListeners
} = useNavigation();

// Modals Composable
const {
  isAuthModalOpen,
  isPlacementOpen,
  isSearchOpen,
  isDictionaryOpen,
  isShortcutsOpen,
  dictionaryWord,
  isSmartRandomOpen,
  smartRandomModule,
  isGoalSettingOpen,
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
  closeSmartRandom,
  openGoalSetting,
  closeGoalSetting
} = useModals();

// Keyboard Shortcuts Composable (Ctrl+K, Ctrl+D, Ctrl+/, 1-7)
useKeyboardShortcuts({
  onSearch: openSearch,
  onDictionary: () => openDictionary(),
  onShortcuts: openShortcuts,
  onSwitchTab: (tab: AppTab) => navigateTo(tab)
});

// User & Learning State
const activeUser = ref<UserAccount>(getActiveUser());
const profile = ref<UserProfile>(getUserProfile());
const results = ref<TestResult[]>(getTestResults());
const mistakesCount = ref<number>(0);
const dueVocabCount = ref<number>(0);
const isMobileMenuOpen = ref<boolean>(false);
const isSidebarCollapsed = ref<boolean>(localStorage.getItem('ielts_sidebar_collapsed') === 'true');

const handleToggleSidebar = () => {
  window.dispatchEvent(new CustomEvent('ielts_toggle_sidebar'));
  isSidebarCollapsed.value = !isSidebarCollapsed.value;
};

const handleStartDrill = (config: RandomDrillConfig, targetTestId: string) => {
  navigateTo(config.module as AppTab, targetTestId);
  closeSmartRandom();
};

const handleSelectTestFromSearch = (module: string, testId: string) => {
  navigateTo(module as AppTab, testId);
  closeSearch();
};

const refreshUserData = () => {
  activeUser.value = getActiveUser();
  profile.value = getUserProfile();
  results.value = getTestResults();
  const m = getMistakes();
  mistakesCount.value = m.filter(item => !item.isResolved).length;
  dueVocabCount.value = getDueEbbinghausItems('vocab').length;
};

const handleEbbinghausUpdate = () => {
  dueVocabCount.value = getDueEbbinghausItems('vocab').length;
};

onMounted(() => {
  refreshUserData();
  setupNavigationListeners();
  window.addEventListener('ielts_auth_changed', refreshUserData);
  window.addEventListener('ielts_ebbinghaus_updated', handleEbbinghausUpdate);
});

onUnmounted(() => {
  cleanupNavigationListeners();
  window.removeEventListener('ielts_auth_changed', refreshUserData);
  window.removeEventListener('ielts_ebbinghaus_updated', handleEbbinghausUpdate);
});

const remainingDays = computed(() => {
  const examDate = new Date(profile.value.examDate);
  return Math.max(0, Math.ceil((examDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
});
</script>

<template>
  <!-- ADMIN MANAGEMENT PORTAL (/admin) -->
  <AdminView 
    v-if="isAdminMode" 
    @returnToPortal="returnToPortal" 
  />

  <!-- STUDENT EXAM PORTAL (DEFAULT) -->
  <div v-else class="flex flex-col h-screen w-screen overflow-hidden bg-[#f5f5f7] font-sans selection:bg-[#1d1d1f] selection:text-white relative">
    <!-- Desktop Native Application TitleBar (macOS Traffic Light Dots & Controls) -->
    <AppTitleBar 
      :currentTab="currentTab"
      :activeUser="activeUser"
      :isSidebarCollapsed="isSidebarCollapsed"
      @navigate="navigateTo($event)"
      @toggleSidebar="handleToggleSidebar"
      @openSearch="openSearch"
      @openDictionary="openDictionary()"
      @openShortcuts="openShortcuts"
      @openAuthModal="openAuth"
      @openPlacementTest="openPlacement"
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
        @selectTab="navigateTo($event)"
        @openAuthModal="openAuth"
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
          @openSearch="openSearch"
          @openDictionary="openDictionary()"
          @openAuthModal="openAuth"
          @navigateTab="navigateTo($event)"
          @openPlacementTest="openPlacement"
          @toggleMobileMenu="isMobileMenuOpen = !isMobileMenuOpen"
          @openAdmin="navigateToAdmin"
        />

        <!-- Scrollable Workspace Content View -->
        <div class="flex-1 overflow-y-auto min-h-0 bg-[#fbfbfd]">
          <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <DashboardView 
              v-if="currentTab === 'dashboard'"
              :profile="profile" 
              :results="results" 
              :activeUser="activeUser"
              :mistakesCount="mistakesCount"
              :dueVocabCount="dueVocabCount"
              @navigate="navigateTo($event)"
              @openPlacementTest="openPlacement"
              @openSmartRandom="openSmartRandom"
            />

            <ReadingView 
              v-else-if="currentTab === 'reading'"
              :key="'read_' + activeUser.id"
              :selectedTestId="selectedTests.reading"
              @refreshMistakes="refreshUserData" 
              @openSearch="openSearch"
              @openDictionary="openDictionary"
              @openSmartRandom="openSmartRandom"
            />

            <ListeningView 
              v-else-if="currentTab === 'listening'"
              :key="'list_' + activeUser.id"
              :selectedTestId="selectedTests.listening"
              @refreshMistakes="refreshUserData" 
              @openSearch="openSearch"
              @openDictionary="openDictionary"
              @openSmartRandom="openSmartRandom"
            />

            <WritingView 
              v-else-if="currentTab === 'writing'"
              :key="'writ_' + activeUser.id"
              :profile="profile" 
              :selectedTaskId="selectedTests.writing"
              @openSearch="openSearch"
              @openSmartRandom="openSmartRandom"
            />

            <SpeakingView 
              v-else-if="currentTab === 'speaking'"
              :key="'spk_' + activeUser.id"
              :selectedTopicId="selectedTests.speaking"
              @openSearch="openSearch"
              @openSmartRandom="openSmartRandom"
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
              @openAuthModal="openAuth"
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
                  @click="openDictionary()"
                  class="text-[#0071e3] hover:underline font-medium cursor-pointer"
                >
                  即时学术词典 (Ctrl+D)
                </button>
                <span class="text-black/10">·</span>
                <button
                  @click="openSearch"
                  class="text-[#0071e3] hover:underline font-medium cursor-pointer"
                >
                  题库搜寻中心 (Ctrl+K)
                </button>
                <span class="text-black/10">·</span>
                <button
                  @click="navigateToAdmin"
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
      @openShortcuts="openShortcuts"
      @openAdmin="navigateToAdmin"
      @openAuthModal="openAuth"
      @openDictionary="openDictionary()"
    />

    <!-- Floating Quick Dictionary Trigger Button -->
    <FloatingDictionaryButton @click="openDictionary()" />

    <!-- Global Question Bank Search Modal -->
    <QuestionBankSearchModal
      :isOpen="isSearchOpen"
      @close="closeSearch"
      @selectTest="handleSelectTestFromSearch"
    />

    <!-- Global Instant Dictionary Modal -->
    <DictionaryModal
      :isOpen="isDictionaryOpen"
      :initialQuery="dictionaryWord"
      @close="closeDictionary"
    />

    <!-- Multi-User Registration & Account Switching Modal -->
    <AuthModal 
      :isOpen="isAuthModalOpen"
      @close="closeAuth"
      @userSwitched="refreshUserData"
      @userRegistered="() => {
        refreshUserData();
        openGoalSetting();
      }"
    />

    <!-- AI Goal & Real Exam Schedule Onboarding Modal -->
    <GoalSettingModal
      :isOpen="isGoalSettingOpen"
      :activeUser="activeUser"
      @close="closeGoalSetting"
      @saved="refreshUserData"
    />

    <!-- 3-Minute Academic Placement Diagnostic Test Modal -->
    <PlacementTestModal
      :isOpen="isPlacementOpen"
      :activeUser="activeUser"
      @close="closePlacement"
      @completed="refreshUserData"
    />

    <!-- Global Smart Random Drill Modal -->
    <SmartRandomModal
      :isOpen="isSmartRandomOpen"
      :initialModule="smartRandomModule"
      @close="closeSmartRandom"
      @startDrill="handleStartDrill"
    />

    <!-- Global Keyboard Shortcuts Modal -->
    <ShortcutsModal 
      :isOpen="isShortcutsOpen" 
      @close="closeShortcuts" 
    />
  </div>
</template>
