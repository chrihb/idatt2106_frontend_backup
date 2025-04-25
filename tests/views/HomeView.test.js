import { mount } from '@vue/test-utils'
import {describe, it, expect, beforeEach} from 'vitest'
import HomeView from '@/views/HomeView.vue'
import i18n from "@/i18n.js";
import mockRouter from "../mocks/MockRouter.js";
import mockPinia from "../mocks/MockPinia.js";

describe('HomeView.vue', () => {
    let wrapper

    beforeEach(() => {
        const router = mockRouter();

        wrapper = mount(HomeView, {
            global: {
                plugins: [i18n, router, mockPinia]
            }
        });
    });

    it('renders', () => {
        expect(wrapper.isVisible()).toBeTruthy();
    });
});
