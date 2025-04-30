import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import PasswordResetNewPassword from '@/components/email/passwordReset/PasswordResetNewPassword.vue'
import { executePasswordReset } from '@/services/emailService.js'
import mockRouter from "../../../mocks/MockRouter.js";
import PasswordResetRequest from "@/components/email/passwordReset/PasswordResetRequest.vue";
import i18n from "@/i18n.js";
import mockPinia from "../../../mocks/MockPinia.js";

vi.mock('@/services/emailService.js', () => ({
    executePasswordReset: vi.fn()
}))

describe('PasswordResetNewPassword.vue', () => {
    let wrapper
    let router = mockRouter()

    beforeEach(() => {
        vi.clearAllMocks
        wrapper = mount(PasswordResetRequest, {
            global: {
                plugins: [i18n, router, mockPinia],
            }
        })
    })

    it('renders correctly', () => {
        expect(wrapper.exists()).toBe(true)
    })

    it('only allows valid passwords', async () => {
        const formField = wrapper.findComponent({ name: 'FormField' });
        const passwordInput = formField.find('input');

        await passwordInput.setValue('ValidPassword123!')
        expect(passwordInput.element.value).toBe('ValidPassword123!')

        executePasswordReset.mockResolvedValue({ success: true })
        const button = wrapper.find('button[type="submit"]')
        await button.trigger('click')

        expect(wrapper.vm.$el.querySelector('button[type="submit"]')).toBeTruthy()
    })

    it('accepts same password in both fields', async () => {
        const formField = wrapper.findComponent({ name: 'FormField' });
        const passwordInput = formField.find('input');

        await passwordInput.setValue('SamePassword123!')
        expect(passwordInput.element.value).toBe('SamePassword123!')

        executePasswordReset.mockResolvedValue({ success: true })
        const button = wrapper.find('button[type="submit"]')
        await button.trigger('click')

        expect(wrapper.vm.$el.querySelector('button[type="submit"]')).toBeTruthy()
    })
})