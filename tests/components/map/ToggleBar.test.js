import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import i18n from "@/i18n.js"
import mockPinia from "../../mocks/MockPinia.js";
import mockRouter from "../../mocks/MockRouter.js";
import ToggleBar from "@/components/map/ToggleBar.vue";

describe('ToggleBar.vue', () => {
    let wrapper

    beforeEach(async () => {
        const router = mockRouter();

        wrapper = mount(ToggleBar, {
            global: {
                plugins: [i18n, router, mockPinia]
            }
        })
    })

    it('renders correctly', () => {
        expect(wrapper.isVisible()).toBeTruthy()
    })
})
