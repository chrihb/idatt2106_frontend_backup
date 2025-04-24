import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import HomeView from '@/views/HomeView.vue'

describe('HomeView.vue', () => {
    it('renders "Welcome"', () => {
        const wrapper = mount(HomeView)
        expect(wrapper.text()).toContain('News')
    })
})
