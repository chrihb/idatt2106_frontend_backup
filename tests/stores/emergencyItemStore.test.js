import { setActivePinia, createPinia } from 'pinia';
import { useEmergencyItemStore } from '@/stores/emergencyItemStore';
import { vi, describe, it, beforeEach, expect } from 'vitest';

vi.mock('@/services/emergencyItemService', () => ({
  emergencyItemService: () => ({
    getEmergencyItemById: vi.fn().mockResolvedValue({
      id: 1,
      name: 'Test Item',
      amount: 10,
      categoryId: 2,
      unitId: 3,
      expirationDate: '2023-12-31',
      householdIds: [1],
    }),
    createEmergencyItem: vi.fn().mockResolvedValue({ id: 2 }),
    updateEmergencyItem: vi.fn().mockResolvedValue({ success: true }),
    deleteEmergencyItem: vi.fn().mockResolvedValue({ success: true }),
  }),
}));

describe('emergencyItemStore', () => {
  let emergencyItemStore;

  beforeEach(() => {
    setActivePinia(createPinia());
    emergencyItemStore = useEmergencyItemStore();
  });

  it('should initialize with default state', () => {
    expect(emergencyItemStore.itemId).toBe(0);
    expect(emergencyItemStore.name).toBe('');
    expect(emergencyItemStore.amount).toBe(0);
    expect(emergencyItemStore.categoryId).toBe(0);
    expect(emergencyItemStore.unitId).toBe(0);
    expect(emergencyItemStore.expirationDate).toBe(null);
    expect(emergencyItemStore.householdIds).toEqual([]);
  });

  it('should fetch an item by ID and set its data', async () => {
    await emergencyItemStore.fetchItemById(1);
    expect(emergencyItemStore.itemId).toBe(1);
    expect(emergencyItemStore.name).toBe('Test Item');
    expect(emergencyItemStore.amount).toBe(10);
    expect(emergencyItemStore.expirationDate).toEqual(new Date('2023-12-31'));
  });

  it('should reset the state', () => {
    emergencyItemStore.itemId = 1;
    emergencyItemStore.resetState();
    expect(emergencyItemStore.itemId).toBe(0);
    expect(emergencyItemStore.name).toBe('');
  });

  it('should save a new item', async () => {
    emergencyItemStore.name = 'New Item';
    emergencyItemStore.amount = 5;
    const result = await emergencyItemStore.saveItem();
    expect(result.id).toBe(2);
    expect(emergencyItemStore.itemId).toBe(2);
  });

  it('should update an existing item', async () => {
    emergencyItemStore.itemId = 1;
    emergencyItemStore.name = 'Updated Item';
    const result = await emergencyItemStore.saveItem();
    expect(result.success).toBe(true);
  });

  it('should delete an item and reset the state', async () => {
    emergencyItemStore.itemId = 1;
    const result = await emergencyItemStore.deleteItem();
    expect(result.success).toBe(true);
    expect(emergencyItemStore.itemId).toBe(0);
  });
});
