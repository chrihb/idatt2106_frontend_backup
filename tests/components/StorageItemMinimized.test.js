import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import i18n from "@/i18n.js"
import StorageItemMinimized from '@/components/emergencyStorage/StorageItemMinimized.vue'
import mockRouter from '../MockRouter.js'

describe('StorageItemMinimized.vue', () => {
  let wrapper

  beforeEach(async () => {
    wrapper = mount(StorageItemMinimized, {
      props: {
        name: 'Water Bottle',
        amount: 5,
        unit: 'L',
        expirationDate: '2024-12-31',
        id: 1
      },
      global: {
        plugins: [i18n, mockRouter]
      }
    })

    await mockRouter.isReady()
  })

  it('renders correctly', () => {
    expect(wrapper.isVisible()).toBeTruthy()
  })

  it('displays the correct props', () => {
    expect(wrapper.text()).toContain('5 L')
    expect(wrapper.text()).toContain('Water Bottle')
    expect(wrapper.text()).toContain('Utløpsdato: 2024-12-31')
  })
})