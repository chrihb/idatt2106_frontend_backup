export function emergencyItemService() {
  const baseUrl = '/api/emergency-items';

  async function getEmergencyItems() {
    const response = await fetch(baseUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch emergency items');
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
    return response.json();
  }

  async function updateEmergencyItem(item) {
    const response = await fetch(`${baseUrl}/${item.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    });
    if (!response.ok) {
      throw new Error('Failed to update emergency item');
    }
    return response.json();
  }

  async function deleteEmergencyItem(id) {
    const response = await fetch(`${baseUrl}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete emergency item');
    }
    return response.json();
  }

  return {
    getEmergencyItems,
    createEmergencyItem,
    updateEmergencyItem,
    deleteEmergencyItem,
  };
}