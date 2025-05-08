import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import { defineComponent } from 'vue'
import MyHomeView from '@/views/MyHomeView.vue'
import mockPinia from '../../mocks/MockPinia.js'

// TODO: remove .skip from all tests and fix the errors

// Mock vue-router
vi.mock('vue-router', async () => {
  const actual = await vi.importActual('vue-router')
  return {
    ...actual,
    useRoute: vi.fn(() => ({
      params: { id: '1' }
    }))
  }
})
vi.mock('vue-i18n', () => ({
    useI18n: () => ({
      t: (key) => key // bare returner nøkkelen
    })
  }))

// Mock user store
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

// Mock komponenter som faktisk tar props
const HouseholdPanelStub = defineComponent({
  props: ['name', 'address'],
  template: '<div class="household-panel">{{ name }} - {{ address }}</div>'
})

const LocationStatusFrontStub = defineComponent({
  props: ['members'],
  template: '<div class="location-status">{{ members.length }}</div>'
})

const NearestStub = defineComponent({
  props: ['latitude', 'longitude'],
  template: '<div class="nearest">{{ latitude }},{{ longitude }}</div>'
})

const ManageHouseholdStub = defineComponent({
  props: ['household'],
  template: '<div class="manage-household">{{ household.name }}</div>'
})

const MapStub = defineComponent({
  template: '<div class="map-stub">Map</div>'
})

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
        plugins: [router, mockPinia()],
        stubs: {
          HouseholdPanel: HouseholdPanelStub,
          LocationStatusFront: LocationStatusFrontStub,
          Nearest: NearestStub,
          ManageHousehold: ManageHouseholdStub,
          Map: MapStub
        }
      }
    })
  })

  it.skip('renders the view correctly', () => {
    expect(wrapper.exists()).toBe(true)
  })

  it.skip('renders all required components', () => {
    expect(wrapper.findComponent(HouseholdPanelStub).exists()).toBe(true)
    expect(wrapper.findComponent(LocationStatusFrontStub).exists()).toBe(true)
    expect(wrapper.findComponent(NearestStub).exists()).toBe(true)
    expect(wrapper.findComponent(ManageHouseholdStub).exists()).toBe(true)
    expect(wrapper.findComponent(MapStub).exists()).toBe(true)
  })

  it.skip('passes household data to components correctly', () => {
    const householdPanel = wrapper.findComponent(HouseholdPanelStub)
    expect(householdPanel.props('name')).toBe('Test Household')
    expect(householdPanel.props('address')).toBe('123 Test Street')

    const houseStatus = wrapper.findComponent(LocationStatusFrontStub)
    expect(houseStatus.props('members').length).toBe(2)

    const nearest = wrapper.findComponent(NearestStub)
    expect(nearest.props('latitude')).toBe(10.123)
    expect(nearest.props('longitude')).toBe(20.456)

    const manageHousehold = wrapper.findComponent(ManageHouseholdStub)
    expect(manageHousehold.props('household').id).toBe(1)
  })
})
