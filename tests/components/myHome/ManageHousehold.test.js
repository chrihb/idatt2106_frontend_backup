import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ManageHousehold from '@/components/myHome/ManageHousehold.vue'
import MyHouseholdView from '@/views/MyHouseholdView.vue'
import { nextTick } from 'vue'

vi.mock('vue-i18n', () => ({
    useI18n: () => ({ t: key => key })
}))

describe('ManageHousehold', () => {
    let wrapper
    const mockHousehold = {
        id: 1,
        name: 'Test Household',
        members: [{ id: 1, name: 'Test User' }]
    }

    beforeEach(() => {
        wrapper = mount(ManageHousehold, {
            props: {
                household: mockHousehold
            },
            global: {
                stubs: {
                    'MyHouseholdView': true,
                    'ArchiveBoxIcon': true
                }
            }
        })
    })

    it('renders correctly', () => {
        expect(wrapper.exists()).toBe(true)
        expect(wrapper.html()).toContain('my-home.manage-household')
    })

    it('has MyHouseholdView component initially hidden', () => {
        const myHousehold = wrapper.findComponent(MyHouseholdView)
        expect(myHousehold.props('isOpen')).toBe(false)
    })

    it('opens MyHouseholdView modal when clicked', async () => {
        const clickableDiv = wrapper.find('.cursor-pointer')
        await clickableDiv.trigger('click')

        await nextTick()

        const myHousehold = wrapper.findComponent(MyHouseholdView)
        expect(myHousehold.props('isOpen')).toBe(true)
    })

    it('passes the correct household prop to MyHouseholdView', () => {
        const myHousehold = wrapper.findComponent(MyHouseholdView)
        expect(myHousehold.props('household')).toEqual(mockHousehold)
    })

    it('closes MyHouseholdView when close event is emitted', async () => {
        const clickableDiv = wrapper.find('.cursor-pointer')
        await clickableDiv.trigger('click')

        wrapper.findComponent(MyHouseholdView).vm.$emit('close')

        await nextTick()

        const myHousehold = wrapper.findComponent(MyHouseholdView)
        expect(myHousehold.props('isOpen')).toBe(false)
    })
})
