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

    it('displays household panels for each household', () => {
        const householdPanels = wrapper.findAllComponents(HouseholdPanel)
        expect(householdPanels.length).toBe(2)
    })

    it('passes correct props to household panels', () => {
        const householdPanels = wrapper.findAllComponents(HouseholdPanel)

        expect(householdPanels[0].props('name')).toBe('Test Household 1')
        expect(householdPanels[0].props('address')).toBe('123 Test Street')

        expect(householdPanels[1].props('name')).toBe('Test Household 2')
        expect(householdPanels[1].props('address')).toBe('456 Sample Avenue')
    })

    it('navigates to household detail when a household panel is clicked', async () => {
        const householdPanels = wrapper.findAll('.cursor-pointer')

        await householdPanels[0].trigger('click')
        expect(router.push).toHaveBeenCalledWith('/household/1')

        await householdPanels[1].trigger('click')
        expect(router.push).toHaveBeenCalledWith('/household/2')
    })
})
