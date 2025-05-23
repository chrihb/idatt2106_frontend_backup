import axios from 'axios';
import { useUserStore } from '@/stores/userStore';

/**
 * Fetches preparedness status for the primary household linked to the authenticated user.
 * Requires JWT token.
 * @returns {Promise<Array>} List of PreparednessStatus objects, one per household.
 */
export const getPreparednessStatus = async () => {
    const userStore = useUserStore();

    const response = await axios.get(`${window.backendURL}/api/households/preparedness`, {
        headers: {
            Authorization: `Bearer ${userStore.token}`
        }
    });

    return response.data; // List of { id, householdName, {daysOfFood, daysOfWater} }
};
