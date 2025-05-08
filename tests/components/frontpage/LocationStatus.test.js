import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import i18n from "@/i18n.js"
import mockRouter from "../../mocks/MockRouter.js";
import mockPinia from "../../mocks/MockPinia.js";
import LocationStatus from "@/components/myHome/LocationStatus.vue";
import mockMapStore from "../../mocks/MockMapStore.js";

vi.mock('@/stores/mapStore.js', () => ({
    useMapStore: () => mockMapStore()
}));
vi.mock('@/utils/mapUtils.js', () => ({
    addMarkerToMap: vi.fn(),
    removeMarkerFromMap: vi.fn(),
}));

describe('LocationStatus.vue', () => {
    let wrapper

    beforeEach(async () => {
        const router = mockRouter();

        wrapper = mount(LocationStatus, {
            props: {
                members: [
                    { id: 1, name: 'John Doe', address: '123 Main St', latitude: 50.0, longitude: 8.0 },
                    { id: 2, name: 'Jane Smith', address: '456 Side Ave', latitude: 51.0, longitude: 9.0 }
                ]
            },
            global: {
                plugins: [i18n, router, mockPinia]
            }
        })
    })

    it('renders correctly', () => {
        expect(wrapper.isVisible()).toBeTruthy()
    })
})
