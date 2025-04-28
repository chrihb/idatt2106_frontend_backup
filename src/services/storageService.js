import axios from 'axios';

/**
 * Fetches preparedness status for the given household.
 * @param householdId
 * @returns {Promise<PreparednessStatus>} preparednessPercent, isWarning, message
 */
export const getPreparednessStatus = async (householdId, baseUrl) => {
    const response = await axios.get(`${baseUrl}/households/${householdId}/preparedness`);
    return response.data;
  };
