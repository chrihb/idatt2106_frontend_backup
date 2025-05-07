import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import MyHouseholdView from '@/views/MyHouseholdView.vue'
import MemberCard from '@/components/myHome/MemberCard.vue'
import ConfirmationModal from '@/components/myHome/ConfirmationModal.vue'
import InviteModal from '@/components/myHome/InviteModal.vue'

const mockRouterPush = vi.fn()
const mockFetchHouseholds = vi.fn().mockResolvedValue()

let mockHouseholdId = [{ id: 1, name: 'Test Household' }]

vi.mock('vue-i18n', () => ({
    useI18n: () => ({ t: key => key })
}))

vi.mock('vue-router', () => ({
    useRouter: () => ({
        push: mockRouterPush
    })
}))

vi.mock('@/stores/userStore.js', () => ({
    useUserStore: () => ({
        token: 'mock-token',
        fetchHouseholds: mockFetchHouseholds,
        get householdId() { return mockHouseholdId },
        $id: 'currentUser'
    })
}))

vi.mock('@/services/householdService.js', () => ({
    verifyIsAdmin: vi.fn().mockResolvedValue(true),
    getInviteCode: vi.fn().mockResolvedValue({ inviteCode: 'test-code' }),
    leaveHouseholdService: vi.fn().mockResolvedValue(true),
    kickUserFromHousehold: vi.fn().mockResolvedValue(true)
}))

describe('MyHouseholdView', () => {
    let wrapper

    const createWrapper = (isOpen = true) => {
        return mount(MyHouseholdView, {
            props: {
                isOpen,
                household: {
                    id: 1,
                    name: 'Test Household',
                    members: [
                        { id: 1, name: 'Admin User', isAdmin: true },
                        { id: 2, name: 'Regular User', isAdmin: false }
                    ]
                }
            },
            global: {
                stubs: {
                    'XMarkIcon': true,
                    'MemberCard': true,
                    'ConfirmationModal': true,
                    'InviteModal': true
                }
            }
        })
    }

    afterEach(() => {
        vi.clearAllMocks()
        mockRouterPush.mockReset()
        mockHouseholdId = [{ id: 1, name: 'Test Household' }]
    })

    it('renders when isOpen is true', () => {
        wrapper = createWrapper(true)
        expect(wrapper.isVisible()).toBe(true)
    })

    it('does not render when isOpen is false', () => {
        wrapper = createWrapper(false)
        expect(wrapper.html()).toBe('<!--v-if-->')
    })

    it('displays member cards for each member', async () => {
        wrapper = createWrapper()
        await nextTick()

        const memberCards = wrapper.findAllComponents(MemberCard)
        expect(memberCards.length).toBe(2)
    })

    it('opens invite modal when generate invite button is clicked', async () => {
        wrapper = createWrapper()

        const inviteButton = wrapper.find('button:first-child')
        await inviteButton.trigger('click')

        await nextTick()

        expect(wrapper.findComponent(InviteModal).exists()).toBe(true)
    })

    it('shows confirmation modal when a member is selected for deletion', async () => {
        wrapper = createWrapper()

        // Simulate member card emitting delete event
        wrapper.findComponent(MemberCard).vm.$emit('delete', { id: 2, name: 'Regular User' })

        await nextTick()

        expect(wrapper.findComponent(ConfirmationModal).exists()).toBe(true)
        expect(wrapper.findComponent(ConfirmationModal).props('member').id).toBe(2)
    })

    it('emits close event when X button is clicked', async () => {
        wrapper = createWrapper()

        const closeButton = wrapper.find('.text-red-500')
        await closeButton.trigger('click')

        expect(wrapper.emitted().close).toBeTruthy()
    })

    it('shows leave household button for non-admin users', async () => {
        const householdService = await import('@/services/householdService.js')
        householdService.verifyIsAdmin.mockResolvedValue(false)

        wrapper = createWrapper()
        await nextTick()

        const leaveButton = wrapper.find('button.bg-red-500')
        expect(leaveButton.exists()).toBe(true)
        expect(leaveButton.text()).toBe('household.leaveHousehold')
    })

    it('redirects to correct page after leaving household', async () => {
        wrapper = createWrapper()

        const householdService = await import('@/services/householdService.js')
        householdService.leaveHouseholdService.mockImplementation(() => {
            mockHouseholdId = []
            return Promise.resolve(true)
        })

        const leaveButton = wrapper.find('button.bg-red-500')
        await leaveButton.trigger('click')
        await nextTick()
        await nextTick()

        expect(mockRouterPush).toHaveBeenCalledWith('/household/options')

        mockRouterPush.mockReset()
        householdService.leaveHouseholdService.mockImplementation(() => {
            mockHouseholdId = [{ id: 2, name: 'Another Household' }]
            return Promise.resolve(true)
        })

        await leaveButton.trigger('click')
        await nextTick()
        await nextTick()

        expect(mockRouterPush).toHaveBeenCalledWith('/household/list')
    })

    it('redirects to correct page after removing the last member', async () => {
        wrapper = createWrapper()

        const householdService = await import('@/services/householdService.js')
        householdService.kickUserFromHousehold.mockImplementation(() => {
            mockHouseholdId = []
            return Promise.resolve(true)
        })

        wrapper.findComponent(MemberCard).vm.$emit('delete', { id: 2, name: 'Regular User' })
        await nextTick()

        wrapper.findComponent(ConfirmationModal).vm.$emit('confirm')
        await nextTick()
        await nextTick()

        expect(mockRouterPush).toHaveBeenCalledWith('/household/options')

        mockRouterPush.mockReset()
        householdService.kickUserFromHousehold.mockImplementation(() => {
            mockHouseholdId = [{ id: 2, name: 'Another Household' }]
            return Promise.resolve(true)
        })

        wrapper.findComponent(MemberCard).vm.$emit('delete', { id: 2, name: 'Regular User' })
        await nextTick()

        wrapper.findComponent(ConfirmationModal).vm.$emit('confirm')
        await nextTick()
        await nextTick()

        expect(mockRouterPush).toHaveBeenCalledWith('/household/list')
    })

    it('closes modals properly', async () => {
        wrapper = createWrapper()

        // Open invite modal
        const inviteButton = wrapper.find('button:first-child')
        await inviteButton.trigger('click')
        await nextTick()

        // Close invite modal
        wrapper.findComponent(InviteModal).vm.$emit('close')
        await nextTick()

        expect(wrapper.findComponent(InviteModal).exists()).toBe(false)

        // Open confirmation modal
        wrapper.findComponent(MemberCard).vm.$emit('delete', { id: 2, name: 'Regular User' })
        await nextTick()

        // Close confirmation modal
        wrapper.findComponent(ConfirmationModal).vm.$emit('close')
        await nextTick()

        expect(wrapper.findComponent(ConfirmationModal).exists()).toBe(false)
    })
})
