import React, { useState, useEffect } from 'react';
import { AppSidebar } from './components/Layout/AppSidebar';
import { AppHeader } from './components/Layout/AppHeader';
import { AuthModal } from './components/Auth/AuthModal';
import { DashboardView } from './components/Dashboard/DashboardView';
import { ReadingView } from './components/Reading/ReadingView';
import { ListeningView } from './components/Listening/ListeningView';
import { WritingView } from './components/Writing/WritingView';
import { SpeakingView } from './components/Speaking/SpeakingView';
import { VocabularyView } from './components/Vocabulary/VocabularyView';
import { MistakesView } from './components/Mistakes/MistakesView';
import { SettingsView } from './components/Settings/SettingsView';
import { QuestionBankSearchModal } from './components/Search/QuestionBankSearchModal';
import { DictionaryModal } from './components/Dictionary/DictionaryModal';
import { FloatingDictionaryButton } from './components/Dictionary/FloatingDictionaryButton';
import { PlacementTestModal } from './components/Placement/PlacementTestModal';
import { getUserProfile, getTestResults, getMistakes } from './services/storage';
import { getActiveUser } from './services/authService';
import { getDueEbbinghausItems } from './services/ebbinghausService';
import { UserProfile, TestResult } from './types/ielts';
import { UserAccount } from './types/auth';

export function App() {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [activeUser, setActiveUser] = useState<UserAccount>(() => getActiveUser());
  const [profile, setProfile] = useState<UserProfile>(() => getUserProfile());
  const [results, setResults] = useState<TestResult[]>([]);
  const [mistakesCount, setMistakesCount] = useState<number>(0);
  const [dueVocabCount, setDueVocabCount] = useState<number>(0);

  // Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPlacementOpen, setIsPlacementOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDictionaryOpen, setIsDictionaryOpen] = useState(false);
  const [dictionaryWord, setDictionaryWord] = useState('');

  // Selected test IDs from Search
  const [selectedTests, setSelectedTests] = useState<{
    reading?: string;
    listening?: string;
    writing?: string;
    speaking?: string;
  }>({});

  const refreshUserData = () => {
    setActiveUser(getActiveUser());
    setProfile(getUserProfile());
    setResults(getTestResults());
    const m = getMistakes();
    setMistakesCount(m.filter(item => !item.isResolved).length);
    setDueVocabCount(getDueEbbinghausItems('vocab').length);
  };

  useEffect(() => {
    refreshUserData();

    // Listen to account changes
    const handleAuthChange = () => {
      refreshUserData();
    };

    // Listen to Ebbinghaus memory review updates
    const handleEbbinghausChange = () => {
      setDueVocabCount(getDueEbbinghausItems('vocab').length);
    };

    // Global keyboard shortcuts (Ctrl+K: Search, Ctrl+D: Dictionary)
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        setIsDictionaryOpen(true);
      }
    };

    window.addEventListener('ielts_auth_changed', handleAuthChange);
    window.addEventListener('ielts_ebbinghaus_updated', handleEbbinghausChange);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('ielts_auth_changed', handleAuthChange);
      window.removeEventListener('ielts_ebbinghaus_updated', handleEbbinghausChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSelectTestFromSearch = (module: string, testId: string) => {
    setSelectedTests(prev => ({ ...prev, [module]: testId }));
    setCurrentTab(module);
    setIsSearchOpen(false);
  };

  const handleOpenDictionary = (word?: string) => {
    setDictionaryWord(word || '');
    setIsDictionaryOpen(true);
  };

  const examDate = new Date(profile.examDate);
  const remainingDays = Math.max(0, Math.ceil((examDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 font-sans selection:bg-red-500 selection:text-white">
      {/* Left Application Portal Sidebar */}
      <AppSidebar 
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        activeUser={activeUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        dueVocabCount={dueVocabCount}
        mistakesCount={mistakesCount}
      />

      {/* Main Right Application Window */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* Top Header Command Bar */}
        <AppHeader 
          activeUser={activeUser}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenDictionary={() => handleOpenDictionary()}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
          onNavigateTab={setCurrentTab}
          onOpenPlacementTest={() => setIsPlacementOpen(true)}
          dueVocabCount={dueVocabCount}
          remainingDays={remainingDays}
        />

        {/* Scrollable Workspace Content View */}
        <div className="flex-1 overflow-y-auto">
          <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {currentTab === 'dashboard' && (
              <DashboardView 
                profile={profile} 
                results={results} 
                onNavigate={setCurrentTab}
                mistakesCount={mistakesCount}
                activeUser={activeUser}
                onOpenPlacementTest={() => setIsPlacementOpen(true)}
              />
            )}

            {currentTab === 'reading' && (
              <ReadingView 
                onRefreshMistakes={refreshUserData} 
                selectedTestId={selectedTests.reading}
                onOpenSearch={() => setIsSearchOpen(true)}
                onOpenDictionary={handleOpenDictionary}
              />
            )}

            {currentTab === 'listening' && (
              <ListeningView 
                onRefreshMistakes={refreshUserData} 
                selectedTestId={selectedTests.listening}
                onOpenSearch={() => setIsSearchOpen(true)}
                onOpenDictionary={handleOpenDictionary}
              />
            )}

            {currentTab === 'writing' && (
              <WritingView 
                profile={profile} 
                selectedTaskId={selectedTests.writing}
                onOpenSearch={() => setIsSearchOpen(true)}
              />
            )}

            {currentTab === 'speaking' && (
              <SpeakingView 
                selectedTopicId={selectedTests.speaking}
                onOpenSearch={() => setIsSearchOpen(true)}
              />
            )}

            {currentTab === 'vocabulary' && (
              <VocabularyView />
            )}

            {currentTab === 'mistakes' && (
              <MistakesView onRefreshMistakes={refreshUserData} />
            )}

            {currentTab === 'settings' && (
              <SettingsView 
                profile={profile} 
                onUpdateProfile={(updated) => {
                  setProfile(updated);
                  refreshUserData();
                }} 
              />
            )}
          </main>

          {/* Global Footer (Apple Minimalist Style) */}
          <footer className="bg-[#f5f5f7] border-t border-black/[0.06] py-6 text-center text-xs text-[#86868b] mt-12">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2.5">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[#1d1d1f]">IELTS Master Portal</span>
                <span>· 雅思全真机考与艾宾浩斯抗遗忘记忆系统</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleOpenDictionary()}
                  className="text-[#0071e3] hover:underline font-medium cursor-pointer"
                >
                  即时学术词典 (Ctrl+D)
                </button>
                <span className="text-black/10">·</span>
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="text-[#0071e3] hover:underline font-medium cursor-pointer"
                >
                  题库搜寻中心 (Ctrl+K)
                </button>
                <span className="text-black/10">·</span>
                <span>当前学员: <strong className="text-[#1d1d1f] font-medium">{activeUser.displayName}</strong></span>
              </div>
            </div>
          </footer>
        </div>
      </div>

      {/* Floating Quick Dictionary Trigger Button */}
      <FloatingDictionaryButton onClick={() => handleOpenDictionary()} />

      {/* Global Question Bank Search Modal */}
      <QuestionBankSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectTest={handleSelectTestFromSearch}
      />

      {/* Global Instant Dictionary Modal */}
      <DictionaryModal
        isOpen={isDictionaryOpen}
        onClose={() => setIsDictionaryOpen(false)}
        initialQuery={dictionaryWord}
      />

      {/* Multi-User Registration & Account Switching Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onUserSwitched={() => refreshUserData()}
        onUserRegistered={() => {
          refreshUserData();
          // Open 3-min diagnostic placement test right after user registration
          setIsPlacementOpen(true);
        }}
      />

      {/* 3-Minute Academic Placement Diagnostic Test Modal */}
      <PlacementTestModal
        isOpen={isPlacementOpen}
        onClose={() => setIsPlacementOpen(false)}
        activeUser={activeUser}
        onCompleted={() => {
          refreshUserData();
        }}
      />
    </div>
  );
}

export default App;
