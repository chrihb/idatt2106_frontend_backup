import { setActivePinia, createPinia } from 'pinia';
import { useMapStore } from '@/stores/mapStore';
import { describe, it, beforeEach, expect, vi } from 'vitest';

describe('mapStore', () => {
  let mapStore;

  beforeEach(() => {
    setActivePinia(createPinia());
    mapStore = useMapStore();
  });

  it('should initialize with default state', () => {
    expect(mapStore.map).toBe(null);
    expect(mapStore.layerGroup).toEqual({});
    expect(mapStore.mapItemIds).toEqual([]);
    expect(mapStore.currentRoute).toBe(null);
  });

  it('should add a map item ID', () => {
    mapStore.addMapItemId(1);
    expect(mapStore.mapItemIds).toContain(1);
  });

  it('should remove a map item ID', () => {
    mapStore.mapItemIds = [1, 2, 3];
    mapStore.removeMapItemId(2);
    expect(mapStore.mapItemIds).toEqual([1, 3]);
  });

  it('should center the map on a specific location', () => {
    mapStore.map = { setView: vi.fn() };
    mapStore.centerMapOnSpecificLocation(10, 20);
    expect(mapStore.map.setView).toHaveBeenCalledWith([10, 20], 15);
  });
});
