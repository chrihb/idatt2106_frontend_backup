import axios from 'axios';
import { useUserStore } from '@/stores/userStore';

/**
 * Fetches essential item status for the authenticated user.
 * @returns {Promise<Array<Array<{name: string, present: boolean}>>>}
 */
export const getEssentialItems = async (householdId) => {
  const userStore = useUserStore();

  const response = await axios.get(`${window.backendURL}/api/households/essential-items/${householdId}`, {
    headers: {
      Authorization: `Bearer ${userStore.token}`,
    },
    params: {
      householdId: householdId,
    },
  });
  return response.data;
};

