import {flushPromises, mount} from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import { createMemoryHistory, createRouter } from 'vue-router'
import i18n from "@/i18n.js"
import EmailVerification from "@/components/email/EmailVerification.vue"
import { requestEmailVerification } from "@/services/emailService.js"

vi.mock('@/services/emailService.js', () => ({
    requestEmailVerification: vi.fn()
}))

describe('EmailVerification.vue', () => {
    let wrapper
    let router

    beforeEach(async () => {
        router = createRouter({
            history: createMemoryHistory(),
            routes: [
                { path: '/', name: 'home', component: { template: '<div>Home</div>' } },
                { path: '/verify/:token', name: 'verify', component: EmailVerification },
            ],
        })

        await router.push('/verify/test-token')
        await router.isReady()

        wrapper = mount(EmailVerification, {
            global: {
                plugins: [i18n, router, createTestingPinia()],
            }
        })
    })

    it('renders correctly', () => {
        expect(wrapper.isVisible()).toBeTruthy()
    })

    it('displays success message on successful verification', async () => {
        requestEmailVerification.mockResolvedValueOnce({ success: 'Verification successful!' })

        wrapper = mount(EmailVerification, {
            global: {
                plugins: [i18n, router, createTestingPinia()],
            }
        })

        await flushPromises()

        const successMessage = wrapper.find('[aria-live="polite"].text-green-600')
        expect(successMessage.exists()).toBe(true)
        expect(successMessage.text()).toBe('Verification successful!')
    })

    it('navigates to the front page when "Ok" button is clicked', async () => {
        const pushSpy = vi.spyOn(router, 'push')

        await wrapper.find('button').trigger('click')
        expect(pushSpy).toHaveBeenCalledWith('/')
    })
})
