import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach} from 'vitest'
import i18n from "@/i18n.js"
import Navbar from '@/components/Navbar.vue'
import mockRouter from '../MockRouter.js'


describe('Navbar.vue', () => {
    let wrapper

    beforeEach(async () => {
        wrapper = mount(Navbar, {
            global: {
                plugins: [i18n, mockRouter]
            }
        })

        await mockRouter.isReady()
    })

    it('renders correctly', () => {
        expect(wrapper.isVisible()).toBeTruthy()
    })
})
