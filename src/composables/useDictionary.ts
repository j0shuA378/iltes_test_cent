import { ref } from 'vue';
import { lookupWord, getWordSuggestions, type DictionaryEntry } from '../data/dictionaryData';
import { toggleWordStar, getVocabProgress } from '../services/storage';

const isDictionaryOpen = ref(false);
const currentQuery = ref('');

export function useDictionary() {
  const currentEntry = ref<DictionaryEntry | null>(null);
  const isLoading = ref(false);
  const hasSearched = ref(false);
  const isStarred = ref(false);
  const suggestions = ref<string[]>([]);
  const recentSearches = ref<string[]>([
    'substantial', 'rewilding', 'mitigate', 'apple', 'equilibrium', 'telecommuting'
  ]);

  const openDictionary = (word?: string) => {
    currentQuery.value = word || '';
    isDictionaryOpen.value = true;
  };

  const closeDictionary = () => {
    isDictionaryOpen.value = false;
  };

  const search = async (word: string) => {
    if (!word || !word.trim()) return;
    const clean = word.trim().toLowerCase();
    isLoading.value = true;
    hasSearched.value = true;

    try {
      const entry = await lookupWord(clean);
      currentEntry.value = entry;

      if (!recentSearches.value.includes(clean)) {
        recentSearches.value = [clean, ...recentSearches.value.slice(0, 7)];
      }

      if (entry) {
        const p = getVocabProgress();
        isStarred.value = Boolean(p[entry.word]?.isStarred);
      } else {
        isStarred.value = false;
      }
    } catch {
      currentEntry.value = null;
    } finally {
      isLoading.value = false;
    }
  };

  const toggleStar = () => {
    if (!currentEntry.value) return;
    const nowStarred = toggleWordStar(currentEntry.value.word);
    isStarred.value = nowStarred;
  };

  const updateSuggestions = (query: string) => {
    if (!query || query.length < 2) {
      suggestions.value = [];
    } else {
      suggestions.value = getWordSuggestions(query);
    }
  };

  return {
    isDictionaryOpen,
    currentQuery,
    currentEntry,
    isLoading,
    hasSearched,
    isStarred,
    suggestions,
    recentSearches,
    openDictionary,
    closeDictionary,
    search,
    toggleStar,
    updateSuggestions
  };
}
