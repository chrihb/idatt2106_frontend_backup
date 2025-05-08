import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import HouseholdListView from '@/views/HouseholdListView.vue'
import HouseholdPanel from '@/components/myHome/HouseholdPanel.vue'

// Mock dependencies
vi.mock('vue-i18n', () => ({
    useI18n: () => ({ t: key => key })
}))

vi.mock('@/stores/userStore.js', () => ({
    useUserStore: vi.fn(() => ({
        householdId: [
            {
                id: 1,
                name: 'Test Household 1',
                address: '123 Test Street'
            },
            {
                id: 2,
                name: 'Test Household 2',
                address: '456 Sample Avenue'
            }
        ]
    }))
}))

describe('HouseholdListView', () => {
    let wrapper
    let router

    beforeEach(() => {
        router = createRouter({
            history: createMemoryHistory(),
            routes: [
                { path: '/', component: {} },
                { path: '/household/:id', component: {}, name: 'household' }
            ]
        })

        router.push = vi.fn()

        wrapper = mount(HouseholdListView, {
            global: {
                plugins: [router],
                stubs: {
                    'HouseholdPanel': true
                }
            }
        })
    })

    it('renders correctly', () => {
        expect(wrapper.exists()).toBe(true)
    })

    it('navigates to household detail when a household panel is clicked', async () => {
        const householdPanels = wrapper.findAll('.cursor-pointer')

        await householdPanels[0].trigger('click')
        expect(router.push).toHaveBeenCalledWith('/household/1')

        await householdPanels[1].trigger('click')
        expect(router.push).toHaveBeenCalledWith('/household/2')
    })
})
