import {shallowMount} from "@vue/test-utils";
import {describe, it, expect, beforeEach, vi} from 'vitest';
import Map from '@/components/frontpage/Map.vue';
import {useMapStore} from '@/stores/mapStore';
import mockPinia from "../mocks/MockPinia.js";
import {useMapStore} from '@/stores/mapStore.js';
import {createCustomMarkerIcon} from "@/utils/markerUtils.js";



describe('Map.vue', () => {
    let mockMapStore;

    vi.mock('@/stores/mapStore', () => ({
        useMapStore: vi.fn(),
    }));

    beforeEach(() => {
        mockPinia();

        mockMapStore = {
            initMap: vi.fn(() => {
                mockMapStore.map = {
                    on: vi.fn(),
                    getBounds: vi.fn(() => ({
                        getNorthEast: vi.fn(),
                        getSouthWest: vi.fn(),
                    })),
                };
            }),
            getLayerGroup: vi.fn(() => ({})),
            getMap: vi.fn(() => ({})),
        };
        useMapStore.mockReturnValue(mockMapStore);
    });

    it('renders the map correctly', () => {
      const wrapper = shallowMount(Map);
      expect(wrapper.find('#map').exists()).toBe(true);
    });

    it('calls initMap on mounted', () => {
        shallowMount(Map);
        expect(mockMapStore.initMap).toHaveBeenCalled();
    });

    it('should create a custom marker icon with the correct URL and size', () => {
        const type = 'Hjertestarter';
        const icon = createCustomMarkerIcon(type);

        expect(icon.options.iconUrl).toBe('/icons/map/Hjertestarter.png');
        expect(icon.options.iconSize).toEqual([40, 40]);
    });

    it('should create a custom marker icon with the correct URL and size', () => {
        const type = 'Hjertestarter';
        const icon = createCustomMarkerIcon(type);

        expect(icon.options.iconUrl).toBe('/icons/map/Hjertestarter.png');
        expect(icon.options.iconSize).toEqual([40, 40]);
    });

})