import { ref, onMounted, onUnmounted } from 'vue';
import { 
  getDueEbbinghausItems, 
  getEbbinghausStats, 
  recordEbbinghausReview,
  STAGE_DESCRIPTIONS
} from '../services/ebbinghausService';
import type { EbbinghausStats } from '../types/auth';

export function useEbbinghaus() {
  const dueVocabCount = ref<number>(getDueEbbinghausItems('vocab').length);
  const dueMistakesCount = ref<number>(getDueEbbinghausItems('mistake').length);
  const stats = ref<EbbinghausStats>(getEbbinghausStats());

  const refreshEbbinghaus = () => {
    dueVocabCount.value = getDueEbbinghausItems('vocab').length;
    dueMistakesCount.value = getDueEbbinghausItems('mistake').length;
    stats.value = getEbbinghausStats();
  };

  const handleUpdate = () => {
    refreshEbbinghaus();
  };

  onMounted(() => {
    window.addEventListener('ielts_ebbinghaus_updated', handleUpdate);
    window.addEventListener('ielts_auth_changed', handleUpdate);
  });

  onUnmounted(() => {
    window.removeEventListener('ielts_ebbinghaus_updated', handleUpdate);
    window.removeEventListener('ielts_auth_changed', handleUpdate);
  });

  return {
    dueVocabCount,
    dueMistakesCount,
    stats,
    stageDescriptions: STAGE_DESCRIPTIONS,
    reviewItem: recordEbbinghausReview,
    refreshEbbinghaus
  };
}
