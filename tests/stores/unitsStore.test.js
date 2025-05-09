import { setActivePinia, createPinia } from 'pinia';
import { useUnitsStore } from '@/stores/unitsStore';
import { describe, it, beforeEach, expect, vi } from 'vitest';
import { emergencyItemService } from '@/services/emergencyItemService.js';

vi.mock('@/services/emergencyItemService.js', () => ({
  emergencyItemService: vi.fn(() => ({
    getEmergencyItemUnits: vi.fn().mockResolvedValue([
      { id: 1, englishName: 'Unit 1', norwegianName: 'Enhet 1' },
    ]),
  })),
}));

describe('unitsStore', () => {
  let unitsStore;

  beforeEach(() => {
    setActivePinia(createPinia());
    unitsStore = useUnitsStore();
  });

  it('should initialize with an empty units array', () => {
    expect(unitsStore.units).toEqual([]);
  });

  it('should fetch units successfully', async () => {
    const mockUnits = [
      { id: 1, englishName: 'Unit 1', norwegianName: 'Enhet 1' },
    ];
    const service = emergencyItemService();
    service.getEmergencyItemUnits.mockResolvedValue(mockUnits);

    await unitsStore.fetchUnits();

    expect(unitsStore.units).toEqual(mockUnits);
  });

  it('should return a unit by ID', () => {
    unitsStore.units = [{ id: 1, englishName: 'Unit 1' }];
    const unit = unitsStore.getUnitById(1);

    expect(unit).toEqual({ id: 1, englishName: 'Unit 1' });
  });

  it('should return the correct unit name based on locale', () => {
    unitsStore.units = [
      { id: 1, englishName: 'Unit 1', norwegianName: 'Enhet 1' },
    ];
    const nameEn = unitsStore.getUnitName(1, 'en');
    const nameNo = unitsStore.getUnitName(1, 'nb-NO');

    expect(nameEn).toBe('Unit 1');
    expect(nameNo).toBe('Enhet 1');
  });

  it('should return "Unknown Unit" for an invalid ID', () => {
    const name = unitsStore.getUnitName(999);

    expect(name).toBe('Unknown Unit');
  });
});
