import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import i18n from "@/i18n.js"
import mockRouter from "../../mocks/MockRouter.js";
import mockPinia from "../../mocks/MockPinia.js";
import CompleteMap from "@/components/map/CompleteMap.vue";

describe('CompleteMap.vue', () => {
    let wrapper

    beforeEach(async () => {
        const router = mockRouter();

        wrapper = mount(CompleteMap, {
            global: {
                plugins: [i18n, router, mockPinia]
            }
        })
    })

    it('renders correctly', () => {
        expect(wrapper.isVisible()).toBeTruthy()
    })
})
