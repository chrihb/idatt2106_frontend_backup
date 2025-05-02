import axios from 'axios';

/**
 * Fetches preparedness status for the given household.
 * @param householdId
 * @returns {Promise<PreparednessStatus>} preparednessPercent, isWarning, message
 */
export const getPreparednessStatus = async (householdId) => {
    const response = await axios.get(`${window.backendURL}/api/households/${householdId}/preparedness`);
    console.log('Preparedness status response:', response.data);
    return response.data;
  };
