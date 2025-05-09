import { setActivePinia, createPinia } from 'pinia';
import { useEmergencyZoneStore } from '@/stores/emergencyZoneStore';
import { vi, describe, it, beforeEach, expect } from 'vitest';

vi.mock('@/services/emergencyZoneService', () => ({
  emergencyZoneService: () => ({
    getEmergencyZoneDetailsById: vi.fn().mockResolvedValue({ success: true, zoneId: 1, name: 'Test Zone' }),
    createEmergencyZone: vi.fn().mockResolvedValue({ zoneId: 1 }),
    updateEmergencyZone: vi.fn().mockResolvedValue({ zoneId: 1 }),
    deleteEmergencyZone: vi.fn().mockResolvedValue({ success: true }),
  }),
}));

describe('emergencyZoneStore', () => {
  let emergencyZoneStore;

  beforeEach(() => {
    setActivePinia(createPinia());
    emergencyZoneStore = useEmergencyZoneStore();
  });

  it('should initialize with default state', () => {
    expect(emergencyZoneStore.emergencyZone).toEqual({
      zoneId: null,
      name: '',
      address: '',
      lat: 0,
      lng: 0,
      type: '',
      level: 0,
      description: '',
      coordinates: [],
    });
    expect(emergencyZoneStore.error).toBe(null);
  });

});
