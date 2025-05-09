import { setActivePinia, createPinia } from 'pinia';
import { useEmergencyItemsStore } from '@/stores/emergencyItemsStore';
import { vi, describe, it, beforeEach, expect } from 'vitest';

vi.mock('@/services/emergencyItemService', () => ({
  emergencyItemService: () => ({
    getEmergencyItems: vi.fn().mockResolvedValue([{ id: 1, name: 'Item 1' }]),
    createEmergencyItem: vi.fn().mockResolvedValue({ id: 2, name: 'Item 2' }),
    updateEmergencyItem: vi.fn().mockResolvedValue({ id: 1, name: 'Updated Item 1' }),
    deleteEmergencyItem: vi.fn().mockResolvedValue(true),
  }),
}));

describe('emergencyItemsStore', () => {
  let emergencyItemsStore;

  beforeEach(() => {
    setActivePinia(createPinia());
    emergencyItemsStore = useEmergencyItemsStore();
  });

  it('should initialize with an empty items array', () => {
    expect(emergencyItemsStore.items).toEqual([]);
  });

  it('should fetch all items', async () => {
    await emergencyItemsStore.fetchAllItems(1);
    expect(emergencyItemsStore.items).toEqual([{ id: 1, name: 'Item 1' }]);
  });


  it('should update an item', async () => {
    emergencyItemsStore.items = [{ id: 1, name: 'Item 1' }];
    const updatedItem = await emergencyItemsStore.updateItem({ id: 1, name: 'Updated Item 1' });
    expect(emergencyItemsStore.items[0]).toEqual(updatedItem);
  });

  it('should delete an item', async () => {
    emergencyItemsStore.items = [{ id: 1, name: 'Item 1' }];
    await emergencyItemsStore.deleteItem(1);
    expect(emergencyItemsStore.items).toEqual([]);
  });
});
