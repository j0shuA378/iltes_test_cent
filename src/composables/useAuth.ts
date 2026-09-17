import { ref, onMounted, onUnmounted } from 'vue';
import { 
  getActiveUser, 
  getAccounts, 
  setActiveUser, 
  registerUser, 
  loginUser, 
  recoverUserByToken,
  updateUserPlacement 
} from '../services/authService';
import type { UserAccount } from '../types/auth';

const activeUser = ref<UserAccount>(getActiveUser());
const accounts = ref<UserAccount[]>(getAccounts());

export function useAuth() {
  const refresh = () => {
    activeUser.value = getActiveUser();
    accounts.value = getAccounts();
  };

  const handleAuthChange = () => {
    refresh();
  };

  onMounted(() => {
    window.addEventListener('ielts_auth_changed', handleAuthChange);
  });

  onUnmounted(() => {
    window.removeEventListener('ielts_auth_changed', handleAuthChange);
  });

  const switchAccount = (userId: string) => {
    const user = setActiveUser(userId);
    refresh();
    return user;
  };

  const register = (params: {
    username: string;
    displayName?: string;
    avatar?: string;
    targetBand?: number;
    examDate?: string;
    password?: string;
  }) => {
    const user = registerUser(params);
    refresh();
    return user;
  };

  const login = (username: string, password?: string) => {
    const res = loginUser(username, password);
    if (res.success && res.user) {
      refresh();
    }
    return res;
  };

  const recoverByToken = (token: string) => {
    const res = recoverUserByToken(token);
    if (res.success && res.user) {
      refresh();
    }
    return res;
  };

  const setPlacement = (placement: {
    testedBand: number;
    rawScore: number;
    totalQuestions: number;
    levelSummary: string;
  }) => {
    const updated = updateUserPlacement(activeUser.value.id, placement);
    refresh();
    return updated;
  };

  return {
    activeUser,
    accounts,
    refresh,
    switchAccount,
    register,
    login,
    recoverByToken,
    setPlacement
  };
}
