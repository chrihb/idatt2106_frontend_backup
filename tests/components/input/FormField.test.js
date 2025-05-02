import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import i18n from "@/i18n.js"
import { defineRule, configure } from 'vee-validate'
import * as rules from '@vee-validate/rules'
import FormField from "@/components/input/FormField.vue"

describe('FormField.vue', () => {
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

        wrapper = mount(FormField, {
            props: {
                fieldName: 'exampleField',
                label: 'Example Field',
                type: 'text'
            },
            global: {
                plugins: [i18n]
            }
        });
    });

    it('renders correctly', () => {
        expect(wrapper.isVisible()).toBeTruthy()
    })

    it('updates value on input', async () => {
        const input = wrapper.find('input')
        await input.setValue('test value')
        expect(input.element.value).toBe('test value')
    })

})
