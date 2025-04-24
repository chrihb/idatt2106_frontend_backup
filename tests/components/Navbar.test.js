import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach} from 'vitest'
import i18n from "@/i18n.js"
import Navbar from '@/components/navigation/Navbar.vue'
import mockRouter from '../mocks/MockRouter.js'
import mockPinia from "../mocks/MockPinia.js";


describe('Navbar.vue', () => {
    let wrapper

    beforeEach(async () => {
        const router = mockRouter();

        wrapper = mount(Navbar, {
            global: {
                plugins: [i18n, router, mockPinia]
            }
        })
    })

    it('renders correctly', () => {
        expect(wrapper.isVisible()).toBeTruthy()
    })
})
