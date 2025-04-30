import { describe, beforeEach, it, vi, expect } from 'vitest'
import PasswordResetRequest from '@/components/email/passwordReset/PasswordResetRequest.vue'
import i18n from '@/i18n.js'
import { mount } from '@vue/test-utils'
import { requestPasswordReset } from '@/services/emailService.js'
import mockRouter from "../../../mocks/MockRouter.js";
import mockPinia from "../../../mocks/MockPinia.js";

// Mock email service
vi.mock('@/services/emailService.js', () => ({
    requestPasswordReset: vi.fn()
}))

describe('PasswordResetRequest.vue', () => {
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

    it('successful password reset request', async () => {
        const formField = wrapper.findComponent({ name: 'FormField' });
        const emailInput = formField.find('input');

        await emailInput.setValue('test@example.com');
        expect(emailInput.element.value).toBe('test@example.com')

        requestPasswordReset.mockResolvedValue({ success: true })
        const button = wrapper.find('button[type="submit"]')
        await button.trigger('click')

        expect(wrapper.vm.$el.querySelector('button[type="submit"]')).toBeTruthy()
    });

    it('failed password reset request', async () => {
        const formField = wrapper.findComponent({ name: 'FormField' });
        const emailInput = formField.find('input');

        await emailInput.setValue('test');
        expect(emailInput.element.value).toBe('test')

        requestPasswordReset.mockResolvedValue({ success: false, error: 'Invalid email address' })
        const button = wrapper.find('button[type="submit"]')
        await button.trigger('click')

        expect(wrapper.vm.$el.querySelector('button[type="submit"]')).toBeTruthy()
    })

    it('error when request fails unexpectedly', async () => {
        const formField = wrapper.findComponent({ name: 'FormField' });
        const emailInput = formField.find('input');

        await emailInput.setValue('test@example.com');
        expect(emailInput.element.value).toBe('test@example.com')

        requestPasswordReset.mockRejectedValue(new Error('Network error'));
        const button = wrapper.find('button[type="submit"]')
        await button.trigger('click')

        expect(wrapper.vm.$el.querySelector('button[type="submit"]')).toBeTruthy()
    })

})
