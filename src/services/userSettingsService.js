import axios from 'axios';
import { useUserStore } from '@/stores/userStore';

export const getUserSettings = async () => {
    const userStore = useUserStore();
    const token = userStore.token || sessionStorage.getItem('token');
  
    if (!token) throw new Error('No token available');
  
    const response = await axios.get(`${window.backendURL}/api/users/settings/get`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('User settings response:', response.data);
    return response.data;
  };  
  

export const saveUserSettings = async (settings) => {
    console.log('Saving user settings:', settings);
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
