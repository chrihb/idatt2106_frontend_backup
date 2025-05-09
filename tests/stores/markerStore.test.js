import { setActivePinia, createPinia } from 'pinia';
import { useMarkerStore } from '@/stores/markerStore';
import { vi, describe, it, beforeEach, expect } from 'vitest';

vi.mock('@/services/markerService', () => ({
  markerService: () => ({
    getMarkerDetailsById: vi.fn().mockResolvedValue({ success: true, markerId: 1, address: 'Test Address' }),
    createMarker: vi.fn().mockResolvedValue({ markerId: 1 }),
    updateMarker: vi.fn().mockResolvedValue({ markerId: 1 }),
    deleteMarker: vi.fn().mockResolvedValue({ success: true }),
  }),
}));

describe('markerStore', () => {
  let markerStore;

  beforeEach(() => {
    setActivePinia(createPinia());
    markerStore = useMarkerStore();
  });

  it('should initialize with default marker state', () => {
    expect(markerStore.marker).toEqual({
      markerId: null,
      address: '',
      lat: null,
      lng: null,
      type: '',
      description: '',
    });
    expect(markerStore.error).toBe(null);
  });
});
