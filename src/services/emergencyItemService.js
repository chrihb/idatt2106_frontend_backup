import {useUserStore} from '@/stores/userStore';

export function emergencyItemService() {
  const baseUrl = `${window.backendURL}/api/emergency/items`;
  const userStore = useUserStore();

  let token = userStore.token || sessionStorage.getItem("jwtToken") || "";

  if (!token) {
    throw new Error("No token found");
  }

  function getToken () {
    return userStore.token || sessionStorage.getItem("jwtToken") || "";
  }

  async function getEmergencyItems() {
    const currentToken = getToken();
    if (!currentToken) {
      throw new Error("No token found");
    }

    const response = await fetch(`${baseUrl}/household/1`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentToken}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch emergency items');
    }
    return response.json();
  }

  async function getEmergencyItemCategories() {
    const currentToken = getToken();
    if (!currentToken) {
      throw new Error("No token found");
    }

    const response = await fetch(
        `${window.backendURL}/api/categories/categories`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${currentToken}`,
          },
        });
    if (!response.ok) {
      throw new Error('Failed to fetch emergency item categories');
    }
    return response.json();
  }

  async function getEmergencyItemUnits() {
    const currentToken = getToken();
    if (!currentToken) {
      throw new Error("No token found");
    }

    const response = await fetch(`${window.backendURL}/api/units`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentToken}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch emergency item units');
    }
    return response.json();
  }

  async function getEmergencyItemByCategoryId(categoryId) {
    const currentToken = getToken();
    if (!currentToken) {
      throw new Error("No token found");
    }

    const response = await fetch(`${baseUrl}/categories/${categoryId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentToken}`,
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch emergency items by category');
    }
    return response.json();
  }

  async function getEmergencyItemById(id) {
    const currentToken = getToken();
    if (!currentToken) {
      throw new Error("No token found");
    }

    const response = await fetch(`${baseUrl}/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentToken}`,
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch emergency item by ID');
    }
    return response.json();
  }

  async function createEmergencyItem(item) {
    const currentToken = getToken();
    if (!currentToken) {
      throw new Error("No token found");
    }

    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentToken}`,
      },
      body: JSON.stringify(item),
    });
    if (!response.ok) {
      throw new Error('Failed to create emergency item');
    }
    return response.body;
  }

  async function updateEmergencyItem(item) {
    const currentToken = getToken();
    if (!currentToken) {
      throw new Error("No token found");
    }

    const response = await fetch(`${baseUrl}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentToken}`,
      },
      body: JSON.stringify(item),
    });
    if (!response.ok) {
      throw new Error('Failed to update emergency item');
    }
    return response.body;
  }

  async function deleteEmergencyItem(id) {
    const currentToken = getToken();
    if (!currentToken) {
      throw new Error("No token found");
    }

    const response = await fetch(`${baseUrl}/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${currentToken}`,
      }
    });
    if (!response.ok) {
      throw new Error('Failed to delete emergency item');
    }
    return response.body;
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