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
            initMap: vi.fn(),
            startTracking: vi.fn(() => {
                mockMapStore.watchId = navigator.geolocation.watchPosition(
                    (position) => {
                        mockMapStore.setCoordinates(position.coords.latitude, position.coords.longitude);
                        mockMapStore.centerMapOnUser();
                    },
                    (error) => {
                        console.error(error);
                    }
                )
            }),
            setCoordinates: vi.fn(),
            centerMapOnUser: vi.fn(),
            getLatitude: vi.fn(() => 63.422464),
            getLongitude: vi.fn(() => 10.410394),
            getCanTrack: vi.fn(() => false),
            getLayerGroup: vi.fn(() => ({})),
            getMap: vi.fn(() => ({})),
        };
        useMapStore.mockReturnValue(mockMapStore);

        global.navigator.geolocation = {
            watchPosition: vi.fn((success) => {
                success({
                    coords: {
                        latitude: 63.422464,
                        longitude: 10.410394,
                    },
                });
            }),
            clearWatch: vi.fn(),
        };
    });

    it('renders the map correctly', () => {
      const wrapper = shallowMount(Map);
      expect(wrapper.find('#map').exists()).toBe(true);
    });

    it('calls watchPosition and updates coordinates', () => {
       const wrapper = shallowMount(Map);
       mockMapStore.startTracking();

       expect(navigator.geolocation.watchPosition).toHaveBeenCalled();
       expect(mockMapStore.setCoordinates).toHaveBeenCalledWith(63.422464, 10.410394);
    });

    it('calls initMap on mounted', () => {
        shallowMount(Map);
        expect(mockMapStore.initMap).toHaveBeenCalled();
    });

    it('calls centerMapOnUser when tracking starts', () => {
        const wrapper = shallowMount(Map);
        mockMapStore.startTracking();
        expect(mockMapStore.centerMapOnUser).toHaveBeenCalled();
    });

    it('calls clearWatch when component is unmounted', () => {
        const mockWatchId = 1;
        navigator.geolocation.watchPosition.mockReturnValue(mockWatchId)
        const wrapper = shallowMount(Map);
        mockMapStore.startTracking();
        wrapper.unmount();
        expect(navigator.geolocation.clearWatch).toHaveBeenCalled();
    });
})