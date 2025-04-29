import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import PasswordResetNewPassword from '@/components/email/passwordReset/PasswordResetNewPassword.vue'
import { executePasswordReset } from '@/services/emailService.js'

vi.mock('@/services/emailService.js', () => ({
    executePasswordReset: vi.fn()
}))

describe('PasswordResetNewPassword.vue', () => {
    it('displays success message on successful password reset', async () => {
        executePasswordReset.mockResolvedValueOnce({ success: true })

        const wrapper = mount(PasswordResetNewPassword, {
            global: {
                mocks: {
                    $route: { params: { token: 'test-token' } }
                }
            }
        })

        await wrapper.find('input[name="password"]').setValue('newpassword123')
        await wrapper.find('input[name="repeatPassword"]').setValue('newpassword123')
        await wrapper.find('form').trigger('submit.prevent')

        expect(executePasswordReset).toHaveBeenCalledWith('test-token', 'newpassword123')
        expect(wrapper.find('.text-green-600').text()).toBe('Password reset successful! You can now log in with your new password.')
    })

    it('displays error message on failed password reset', async () => {
        executePasswordReset.mockResolvedValueOnce({ error: 'Token Invalid' })

        const wrapper = mount(PasswordResetNewPassword, {
            global: {
                mocks: {
                    $route: { params: { token: 'test-token' } }
                }
            }
        })

        await wrapper.find('input[name="password"]').setValue('newpassword123')
        await wrapper.find('input[name="repeatPassword"]').setValue('newpassword123')
        await wrapper.find('form').trigger('submit.prevent')

        expect(wrapper.find('.text-red-600').text()).toBe('Token Invalid')
    })
})