<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import AppSidebar from './components/Layout/AppSidebar.vue';
import AppHeader from './components/Layout/AppHeader.vue';
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
import { getUserProfile, getTestResults, getMistakes } from './services/storage';
import { getActiveUser } from './services/authService';
import { getDueEbbinghausItems } from './services/ebbinghausService';
import type { UserProfile, TestResult } from './types/ielts';
import type { UserAccount } from './types/auth';

const currentTab = ref<string>('dashboard');
const activeUser = ref<UserAccount>(getActiveUser());
const profile = ref<UserProfile>(getUserProfile());
const results = ref<TestResult[]>(getTestResults());
const mistakesCount = ref<number>(0);
const dueVocabCount = ref<number>(0);
const isAdminMode = ref<boolean>(false);
const isMobileMenuOpen = ref<boolean>(false);

// Modals
const isAuthModalOpen = ref(false);
const isPlacementOpen = ref(false);
const isSearchOpen = ref(false);
const isDictionaryOpen = ref(false);
const dictionaryWord = ref('');

// Selected test IDs from Search
const selectedTests = ref<{
  reading?: string;
  listening?: string;
  writing?: string;
  speaking?: string;
}>({});

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
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    isSearchOpen.value = true;
  }
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
    e.preventDefault();
    isDictionaryOpen.value = true;
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
  <div v-else class="flex h-screen w-screen overflow-hidden bg-[#f5f5f7] font-sans selection:bg-[#1d1d1f] selection:text-white relative">
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
            :profile="profile" 
            :results="results" 
            :mistakesCount="mistakesCount"
            :activeUser="activeUser"
            @navigate="currentTab = $event"
            @openPlacementTest="isPlacementOpen = true"
          />

          <ReadingView 
            v-else-if="currentTab === 'reading'"
            :selectedTestId="selectedTests.reading"
            @refreshMistakes="refreshUserData" 
            @openSearch="isSearchOpen = true"
            @openDictionary="handleOpenDictionary"
          />

          <ListeningView 
            v-else-if="currentTab === 'listening'"
            :selectedTestId="selectedTests.listening"
            @refreshMistakes="refreshUserData" 
            @openSearch="isSearchOpen = true"
            @openDictionary="handleOpenDictionary"
          />

          <WritingView 
            v-else-if="currentTab === 'writing'"
            :profile="profile" 
            :selectedTaskId="selectedTests.writing"
            @openSearch="isSearchOpen = true"
          />

          <SpeakingView 
            v-else-if="currentTab === 'speaking'"
            :selectedTopicId="selectedTests.speaking"
            @openSearch="isSearchOpen = true"
          />

          <VocabularyView 
            v-else-if="currentTab === 'vocabulary'"
          />

          <MistakesView 
            v-else-if="currentTab === 'mistakes'"
            @refreshMistakes="refreshUserData" 
          />

          <SettingsView 
            v-else-if="currentTab === 'settings'"
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
  </div>
</template>
