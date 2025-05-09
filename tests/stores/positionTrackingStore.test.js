import { setActivePinia, createPinia } from 'pinia';
import { usePositionTrackingStore } from '@/stores/positionTrackingStore';
import { useMapStore } from '@/stores/mapStore';
import { watchUserPosition } from '@/services/geoLocationService';
import { describe, it, beforeEach, expect, vi } from 'vitest';

vi.mock('@/services/geoLocationService', () => ({
  watchUserPosition: vi.fn(),
}));

vi.mock('@/stores/mapStore', () => ({
  useMapStore: vi.fn(() => ({
    map: { setView: vi.fn() },
    layerGroup: {},
    centerMapOnSpecificLocation: vi.fn(),
  })),
}));

describe('positionTrackingStore', () => {
  let positionTrackingStore;
  let mapStore;

  beforeEach(() => {
    setActivePinia(createPinia());
    positionTrackingStore = usePositionTrackingStore();
    mapStore = useMapStore();
  });

  it('should initialize with default state', () => {
    expect(positionTrackingStore.latitude).toBe(null);
    expect(positionTrackingStore.longitude).toBe(null);
    expect(positionTrackingStore.watchId).toBe(null);
  });

  it('should set coordinates', () => {
    positionTrackingStore.setCoordinates(10, 20);
    expect(positionTrackingStore.latitude).toBe(10);
    expect(positionTrackingStore.longitude).toBe(20);
  });
});
