import axios from 'axios';
import { useUserStore } from '@/stores/userStore';

/**
 * Fetches essential item status for the authenticated user.
 * @returns {Promise<Array<Array<{name: string, present: boolean}>>>}
 */
export const getEssentialItems = async () => {
  const userStore = useUserStore();

  const response = await axios.get(`${window.backendURL}/api/households/essential-items`, {
    headers: {
      Authorization: `Bearer ${userStore.token}`,
    },
  });

  return response.data;
};

