import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import EmergencyStorage from '@/views/EmergencyStorage.vue'

describe('HomeView.vue', () => {
  it('renders "Emergency Storage"', () => {
    const wrapper = mount(EmergencyStorage)
    expect(wrapper.text()).toContain('Emergency Storage')
  })
})
