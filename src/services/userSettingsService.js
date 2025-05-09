import axios from 'axios';
import { useUserStore } from '@/stores/userStore';

export const getUserSettings = async () => {
    const userStore = useUserStore();

    try {
    const response = await axios.get(`${window.backendURL}/api/users/settings/get`, {
      headers: {
        Authorization: `Bearer ${userStore.token}`
      }
    });

    if (response.status !== 200) {
        return null;
    }

    return response.data;
    } catch (error) {
    }
  };  
  

export const saveUserSettings = async (settings) => {
  const userStore = useUserStore();
  const token = userStore.token || sessionStorage.getItem('token');

  if (!token) throw new Error('No token available');

  await axios.post(`${window.backendURL}/api/users/settings/save`, settings, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
};
