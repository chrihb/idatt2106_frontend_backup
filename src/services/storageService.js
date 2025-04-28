import axios from 'axios';

/**
 * Fetches preparedness status for the given household.
 * @param householdId
 * @returns {Promise<PreparednessStatus>} preparednessPercent, isWarning, message
 */
export const getPreparednessStatus = async (householdId) => {
    const response = await axios.get(`${window.backendURL}/households/${householdId}/preparedness`);
    return response.data;
  };
