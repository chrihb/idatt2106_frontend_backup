import {describe} from "vitest";
import PasswordResetRequest from "@/components/email/passwordReset/PasswordResetRequest.vue";
import {createTestingPinia} from "@pinia/testing";
import i18n from "@/i18n.js";
import mockRouter from "../../../mocks/MockRouter.js";
import {mount} from "@vue/test-utils";
import {requestPasswordReset} from "@/services/emailService.js";


vi.mock('@/services/emailService.js', () => ({
    requestPasswordReset: vi.fn()
}))

describe('PasswordResetRequest.vue', () => {
    let wrapper


    beforeEach(() => {
        const router = mockRouter()

        wrapper = mount(PasswordResetRequest, {
            global: {
                plugins: [i18n, router, createTestingPinia()]
            }
        })
    })

    it('renders correctly', () => {
        expect(wrapper.exists()).toBe(true)
    })

    it('displays success message on successful password reset request', async () => {
        await wrapper.find('input[name="email"]').setValue('test@example.com')
        await requestPasswordReset(wrapper.find.email()).mockResolvedValue({ success: true })

        await wrapper.find('form').trigger('submit.prevent')

        expect(requestPasswordReset).toHaveBeenCalledWith({ email: 'test@example.com'} )
        expect(wrapper.find('.text-green-600').text()).toBe('Password reset email sent! Please check your inbox.')
    })
})
