import { useUserStore } from '@/stores/userStore';
import axios from 'axios';

export function emergencyItemService() {
  const baseUrl = `${window.backendURL}/api/emergency/items`;
  const userStore = useUserStore();

  function getToken() {
    return userStore.token || sessionStorage.getItem("jwtToken") || "";
  }

  function createAxiosInstance() {
    const token = getToken();
    if (!token) {
      throw new Error("No token found");
    }

    return axios.create({
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
  }

  async function getEmergencyItems(householdId) {
    try {
      const api = createAxiosInstance();
      const response = await api.get(`${baseUrl}/household/${householdId}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch emergency items');
    }
  }

  async function getEmergencyItemCategories() {
    try {
      const api = createAxiosInstance();
      const response = await api.get(`${window.backendURL}/api/categories/categories`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch emergency item categories');
    }
  }

  async function getEmergencyItemUnits() {
    try {
      const api = createAxiosInstance();
      const response = await api.get(`${window.backendURL}/api/units`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch emergency item units');
    }
  }

  async function getEmergencyItemByCategoryId(categoryId) {
    try {
      const api = createAxiosInstance();
      const response = await api.get(`${baseUrl}/categories/${categoryId}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch emergency items by category');
    }
  }

  async function getEmergencyItemById(id) {
    try {
      const api = createAxiosInstance();
      const response = await api.get(`${baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch emergency item by ID');
    }
  }

  async function createEmergencyItem(item) {
    try {
      const api = createAxiosInstance();
      const response = await api.post(baseUrl, item);
      return response.data;
    } catch (error) {
      throw new Error('Failed to create emergency item');
    }
  }

  async function updateEmergencyItem(item) {
    try {
      const api = createAxiosInstance();
      const response = await api.put(baseUrl, item);
      return response.data;
    } catch (error) {
      throw new Error('Failed to update emergency item');
    }
  }

  async function deleteEmergencyItem(id) {
    try {
      const api = createAxiosInstance();
      const response = await api.delete(`${baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to delete emergency item');
    }
  }

  return {
    getEmergencyItems,
    getEmergencyItemById,
    getEmergencyItemByCategoryId,
    getEmergencyItemCategories,
    getEmergencyItemUnits,
    createEmergencyItem,
    updateEmergencyItem,
    deleteEmergencyItem,
  };
}