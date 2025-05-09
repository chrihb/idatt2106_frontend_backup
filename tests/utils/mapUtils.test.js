import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as mapUtils from '@/utils/mapUtils';
import { useMapStore } from '@/stores/mapStore';
import { useMarkersStore } from '@/stores/markersStore';

vi.mock('@/stores/mapStore', () => ({
  useMapStore: vi.fn(() => ({
    map: { fitBounds: vi.fn(), setView: vi.fn() },
    layerGroup: {},
    addMapItemId: vi.fn(),
    removeMapItemId: vi.fn(),
  })),
}));

vi.mock('@/stores/markersStore', () => ({
  useMarkersStore: vi.fn(() => ({
    getMarkerById: vi.fn(),
  })),
}));

describe('mapUtils', () => {
  let mapStore;
  let markersStore;

  beforeEach(() => {
    mapStore = useMapStore();
    markersStore = useMarkersStore();
    vi.clearAllMocks();
  });

  it('should create a custom marker icon', () => {
    const icon = mapUtils.createCustomMarkerIcon('testType');
    expect(icon.options.iconUrl).toBe('/icons/map/testType.png');
  });

});
