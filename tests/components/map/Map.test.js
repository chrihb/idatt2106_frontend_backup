import {flushPromises, shallowMount} from "@vue/test-utils";
import {describe, it, expect, beforeEach, vi} from 'vitest';
import Map from '@/components/map/Map.vue';
import mockPinia from "../../mocks/MockPinia.js";
import {useMapStore} from '@/stores/mapStore.js';
import {createCustomMarkerIcon} from "@/utils/mapUtils.js";



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

    it('calls initMap on mounted', async () => {
        shallowMount(Map);
        await flushPromises();
        expect(mockMapStore.initMap).toHaveBeenCalled();
    });

    it('should create a custom marker icon with the correct URL and size', () => {
        const type = 'Hjertestarter';
        const icon = createCustomMarkerIcon(type);

        expect(icon.options.iconUrl).toBe('/icons/map/Hjertestarter.png');
        expect(icon.options.iconSize).toEqual([25, 25]);
    });

    it('should create a custom marker icon with the correct URL and size', () => {
        const type = 'Hjertestarter';
        const icon = createCustomMarkerIcon(type);

        expect(icon.options.iconUrl).toBe('/icons/map/Hjertestarter.png');
        expect(icon.options.iconSize).toEqual([25, 25]);
    });

})