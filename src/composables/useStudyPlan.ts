import { ref } from 'vue';
import { 
  DEFAULT_PLAN_CONFIG, 
  STUDY_PHASES, 
  getDailyTasksForPhase,
  type PersonalizedPlanConfig,
  type StudyPlanPhase,
  type DailyPlanTask
} from '../data/studyPlanData';
import { 
  getStudyPlanConfig, 
  saveStudyPlanConfig, 
  getCompletedPlanTasks, 
  togglePlanTask 
} from '../services/storage';

export function useStudyPlan() {
  const planConfig = ref<PersonalizedPlanConfig>(getStudyPlanConfig() || DEFAULT_PLAN_CONFIG);
  const activePhaseIndex = ref(0);
  const completedTasks = ref<Record<string, boolean>>(getCompletedPlanTasks());

  const refreshPlan = () => {
    planConfig.value = getStudyPlanConfig() || DEFAULT_PLAN_CONFIG;
    completedTasks.value = getCompletedPlanTasks();
  };

  const updateConfig = (newConfig: PersonalizedPlanConfig) => {
    planConfig.value = newConfig;
    saveStudyPlanConfig(newConfig);
  };

  const toggleTask = (taskId: string) => {
    const isDone = togglePlanTask(taskId);
    completedTasks.value = {
      ...completedTasks.value,
      [taskId]: isDone
    };
    return isDone;
  };

  return {
    planConfig,
    activePhaseIndex,
    completedTasks,
    phases: STUDY_PHASES,
    getDailyTasksForPhase,
    refreshPlan,
    updateConfig,
    toggleTask
  };
}
