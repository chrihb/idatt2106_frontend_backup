import { setActivePinia, createPinia } from 'pinia';
import { useMarkersStore } from '@/stores/markersStore';
import { vi, describe, it, beforeEach, expect } from 'vitest';

vi.mock('@/services/markerService', () => ({
  markerService: () => ({
    getAllMarkers: vi.fn().mockResolvedValue({ success: true, markers: [{ markerId: 1, type: 'Test' }] }),
  }),
}));

describe('markersStore', () => {
  let markersStore;

  beforeEach(() => {
    setActivePinia(createPinia());
    markersStore = useMarkersStore();
  });

  it('should initialize with an empty markers array', () => {
    expect(markersStore.markers).toEqual([]);
    expect(markersStore.error).toBe(null);
  });

  it('should clear all markers', () => {
    markersStore.markers = [{ markerId: 1 }, { markerId: 2 }];
    markersStore.clearMarkers();
    expect(markersStore.markers).toEqual([]);
  });

  it('should fetch all markers successfully', async () => {
    await markersStore.fetchAllMarkers();
    expect(markersStore.markers).toEqual([{ markerId: 1, type: 'Test' }]);
  });
});
