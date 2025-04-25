import {shallowMount} from "@vue/test-utils";
import {describe, it, expect, beforeEach, vi} from 'vitest';
import Map from '@/components/frontpage/Map.vue';
import {useMapStore} from '@/stores/mapStore';


vi.mock('@/stores/mapStore', () => ({
    useMapStore: vi.fn(),
}));

describe('Map.vue', () => {
    let mockMapStore;

    beforeEach(() => {
        mockMapStore = {
            initMap: vi.fn(() => {
                mockMapStore.map = {
                    on: vi.fn(() => ({
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

})