import axios from 'axios';

/**
 * Fetches essential item status for a given household.
 * @param {number} householdId - The ID of the household.
 * @returns {Promise<Array<{name: string, present: boolean}>>}
 */
export const getEssentialItems = async (householdId) => {
  try {
    const response = await axios.get(`${window.backendURL}/api/households/${householdId}/essential-items`);
    return response.data;
  } catch (error) {
    console.error('Feil ved henting av essential items:', error);
    throw error;
  }
};
