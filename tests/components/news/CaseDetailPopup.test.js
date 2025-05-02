import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import CaseDetailPopup from '@/components/news/CaseDetailPopup.vue'
import { createI18n } from 'vue-i18n'

// Mock i18n instance
const i18n = createI18n({
    locale: 'en',
    messages: {
        en: {
            news: {
                noDetails: 'No details available.',
                date: 'Date',
                district: 'District',
            },
        },
    },
})

describe('CaseDetailPopup.vue', () => {
    it('renders loading state', () => {
        const wrapper = mount(CaseDetailPopup, {
            props: {
                caseId: '123',
                onClose: () => {},
            },
            global: {
                plugins: [i18n],
            },
            data() {
                return { isLoading: true }
            },
        })

        expect(wrapper.text()).toContain('Loading...')
    })
})
