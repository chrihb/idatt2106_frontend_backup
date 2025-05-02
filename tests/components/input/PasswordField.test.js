import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import i18n from "@/i18n.js"
import { defineRule, configure } from 'vee-validate'
import * as rules from '@vee-validate/rules'
import PasswordField from "@/components/input/PasswordField.vue"

describe('PasswordField.vue', () => {
    let wrapper

    beforeEach(() => {
        // Register only valid rule functions
        Object.entries(rules).forEach(([ruleName, ruleFn]) => {
            if (typeof ruleFn === 'function') {
                defineRule(ruleName, ruleFn);
            }
        });

        configure({
            generateMessage: ctx => `${ctx.field} is invalid`
        });

        wrapper = mount(PasswordField, {
            props: {
                fieldName: 'password',
                label: 'Password',
                modelValue: ''
            },
            global: {
                plugins: [i18n]
            }
        });
    });

    it('renders correctly', () => {
        expect(wrapper.isVisible()).toBeTruthy()
    });

    it('updates value on input', async () => {
        const input = wrapper.find('input')
        await input.setValue('testPassword')
        expect(input.element.value).toBe('testPassword')
    });

    it('toggles password visibility', async () => {
        const toggleButton = wrapper.find('button.toggle-password')
        const input = wrapper.find('input')

        expect(input.attributes('type')).toBe('password')

        await toggleButton.trigger('click')
        expect(input.attributes('type')).toBe('text')

        await toggleButton.trigger('click')
        expect(input.attributes('type')).toBe('password')
    });
});
