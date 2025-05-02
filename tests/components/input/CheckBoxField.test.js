import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import i18n from "@/i18n.js"
import { defineRule, configure } from 'vee-validate'
import * as rules from '@vee-validate/rules'
import CheckboxField from "@/components/input/CheckboxField.vue"

describe('CheckboxField.vue', () => {
    let wrapper

    beforeEach(() => {
        Object.entries(rules).forEach(([ruleName, ruleFn]) => {
            if (typeof ruleFn === 'function') {
                defineRule(ruleName, ruleFn);
            }
        });

        configure({
            generateMessage: ctx => `${ctx.field} is invalid`
        });

        wrapper = mount(CheckboxField, {
            props: {
                fieldName: 'acceptTerms',
                label: 'Accept Terms',
                modelValue: false
            },
            global: {
                plugins: [i18n]
            }
        });
    });

    it('renders correctly', () => {
        expect(wrapper.isVisible()).toBeTruthy()
    });

    it('updates value on toggle', async () => {
        const checkbox = wrapper.find('input[type="checkbox"]')
        expect(checkbox.element.checked).toBe(false)

        await checkbox.setValue(true)
        expect(checkbox.element.checked).toBe(true)

        await checkbox.setValue(false)
        expect(checkbox.element.checked).toBe(false)
    });
});
