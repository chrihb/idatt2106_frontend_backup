import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import MyHomeView from '@/views/MyHomeView.vue'
import HouseholdPanel from '@/components/myHome/HouseholdPanel.vue'
import HouseStatus from '@/components/frontpage/HouseStatus.vue'
import Nearest from '@/components/myHome/Nearest.vue'
import ManageHousehold from '@/components/myHome/ManageHousehold.vue'
import Map from '@/components/map/Map.vue'

vi.mock('vue-router', async () => {
    const actual = await vi.importActual('vue-router')
    return {
        ...actual,
        useRoute: vi.fn(() => ({
            params: { id: '1' }
        }))
    }
})

vi.mock('@/stores/userStore.js', () => ({
    useUserStore: vi.fn(() => ({
        householdId: [
            {
                id: 1,
                name: 'Test Household',
                address: '123 Test Street',
                latitude: 10.123,
                longitude: 20.456,
                members: [
                    { id: 1, name: 'Test User 1' },
                    { id: 2, name: 'Test User 2' }
                ]
            }
        ]
    }))
}))

describe('MyHomeView', () => {
    let wrapper
    let router

    beforeEach(() => {
        router = createRouter({
            history: createMemoryHistory(),
            routes: [{ path: '/', component: {} }]
        })

        wrapper = mount(MyHomeView, {
            global: {
                plugins: [router],
                stubs: {
                    'HouseholdPanel': true,
                    'HouseStatus': true,
                    'Nearest': true,
                    'ManageHousehold': true,
                    'Map': true
                }
            }
        })
    })

    it('renders the view correctly', () => {
        expect(wrapper.exists()).toBe(true)
    })

    it('renders all required components', () => {
        expect(wrapper.findComponent(HouseholdPanel).exists()).toBe(true)
        expect(wrapper.findComponent(HouseStatus).exists()).toBe(true)
        expect(wrapper.findComponent(Nearest).exists()).toBe(true)
        expect(wrapper.findComponent(ManageHousehold).exists()).toBe(true)
        expect(wrapper.findComponent(Map).exists()).toBe(true)
    })

    it('passes household data to components correctly', () => {
        const householdPanel = wrapper.findComponent(HouseholdPanel)
        expect(householdPanel.props('name')).toBe('Test Household')
        expect(householdPanel.props('address')).toBe('123 Test Street')

        const houseStatus = wrapper.findComponent(HouseStatus)
        expect(houseStatus.props('members').length).toBe(2)

        const nearest = wrapper.findComponent(Nearest)
        expect(nearest.props('latitude')).toBe(10.123)
        expect(nearest.props('longitude')).toBe(20.456)

        const manageHousehold = wrapper.findComponent(ManageHousehold)
        expect(manageHousehold.props('household').id).toBe(1)
    })
})
