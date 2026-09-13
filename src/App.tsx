import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
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
import { getUserProfile, getTestResults, getMistakes } from './services/storage';
import { UserProfile, TestResult } from './types/ielts';

export function App() {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [profile, setProfile] = useState<UserProfile>(getUserProfile());
  const [results, setResults] = useState<TestResult[]>([]);
  const [mistakesCount, setMistakesCount] = useState<number>(0);

  // Search & Test selection states
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedTests, setSelectedTests] = useState<{
    reading?: string;
    listening?: string;
    writing?: string;
    speaking?: string;
  }>({});

  // Instant Dictionary state
  const [isDictionaryOpen, setIsDictionaryOpen] = useState(false);
  const [dictionaryWord, setDictionaryWord] = useState('');

  const refreshUserData = () => {
    setProfile(getUserProfile());
    setResults(getTestResults());
    const m = getMistakes();
    setMistakesCount(m.filter(item => !item.isResolved).length);
  };

  useEffect(() => {
    refreshUserData();
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

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans selection:bg-red-500 selection:text-white">
      {/* Top Navigation with Auto-Hide and Quick Actions */}
      <Navbar 
        currentTab={currentTab} 
        onSelectTab={setCurrentTab} 
        profile={profile} 
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenDictionary={() => handleOpenDictionary()}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentTab === 'dashboard' && (
          <DashboardView 
            profile={profile} 
            results={results} 
            onNavigate={setCurrentTab}
            mistakesCount={mistakesCount}
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

      {/* Global Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400">IELTS Master</span>
            <span>· 全真学术类雅思机考模拟训练系统</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleOpenDictionary()}
              className="text-teal-400 hover:text-teal-300 font-medium"
            >
              📖 即时学术词典
            </button>
            <span>·</span>
            <button
              onClick={() => setIsSearchOpen(true)}
              className="text-amber-400 hover:text-amber-300 font-medium"
            >
              🔍 题库搜寻中心
            </button>
            <span>·</span>
            <span>离线本地优先存储 · 保护个人隐私</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
