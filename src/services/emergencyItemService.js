export function emergencyItemService() {
  const baseUrl = `${window.backendURL}/api/emergency/items`;

  async function getEmergencyItems() {
    const response = await fetch(`${baseUrl}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch emergency items');
    }
    return response.json();
  }

  async function getEmergencyItemCategories() {
    const response = await fetch(`${window.backendURL}/api/categories/categories`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch emergency item categories');
    }
    return response.json();
  }

  async function getEmergencyItemUnits() {
    const response = await fetch(`${window.backendURL}/api/units`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch emergency item units');
    }
    return response.json();
  }

  async function getEmergencyItemByCategoryId(categoryId) {
    const response = await fetch(`${baseUrl}/categories/${categoryId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch emergency items by category');
    }
    return response.json();
  }

  async function getEmergencyItemById(id) {
    const response = await fetch(`${baseUrl}/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch emergency item by ID');
    }
    return response.json();
  }

  async function createEmergencyItem(item) {
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    });
    if (!response.ok) {
      throw new Error('Failed to create emergency item');
    }
    return response.body;
  }

  async function updateEmergencyItem(item) {
    const response = await fetch(`${baseUrl}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    });
    if (!response.ok) {
      throw new Error('Failed to update emergency item');
    }
    return response.body;
  }

  async function deleteEmergencyItem(id) {
    const response = await fetch(`${baseUrl}/${id}`, {
      method: 'DELETE',
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