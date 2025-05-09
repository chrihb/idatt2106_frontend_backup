import { setActivePinia, createPinia } from 'pinia';
import { useEmergencyZonesStore } from '@/stores/emergencyZonesStore';
import { vi, describe, it, beforeEach, expect } from 'vitest';

vi.mock('@/services/emergencyZoneService', () => ({
  emergencyZoneService: () => ({
    getAllEmergencyZones: vi.fn().mockResolvedValue({ success: true, zones: [{ zoneId: 1, name: 'Zone 1' }] }),
    getEmergencyZonesMock: vi.fn().mockResolvedValue({ zones: [{ zoneId: 2, name: 'Zone 2' }] }),
  }),
}));

describe('emergencyZonesStore', () => {
  let emergencyZonesStore;

  beforeEach(() => {
    setActivePinia(createPinia());
    emergencyZonesStore = useEmergencyZonesStore();
  });

  it('should initialize with an empty emergency zones array', () => {
    expect(emergencyZonesStore.emergencyZones).toEqual([]);
    expect(emergencyZonesStore.error).toBe(null);
  });

  it('should delete an emergency zone', () => {
    emergencyZonesStore.emergencyZones = [{ zoneId: 1, name: 'Zone 1' }];
    emergencyZonesStore.deleteEmergencyZone(1);
    expect(emergencyZonesStore.emergencyZones).toEqual([]);
  });
});
