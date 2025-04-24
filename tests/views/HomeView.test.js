import { mount } from '@vue/test-utils'
import {describe, it, expect, beforeEach} from 'vitest'
import HomeView from '@/views/HomeView.vue'
import i18n from "@/i18n.js";
import mockRouter from "../MockRouter.js";

describe('HomeView.vue', () => {
    let wrapper

    beforeEach(async () => {
        wrapper = mount(HomeView, {
            global: {
                plugins: [i18n, mockRouter]
            }
        })

        await mockRouter.isReady()
    })


    it('renders "Welcome"', () => {
        expect(wrapper.isVisible()).toBeTruthy()
    })
})
