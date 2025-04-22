import { createI18n } from 'vue-i18n'
import en from '@/lang/en-US.json'
import nb from '@/lang/nb-NO.json'

const i18n = createI18n({
    legacy: false,
    locale: 'en-US',
    fallbackLocale: 'en-US',
    messages: {
        'nb-NO': nb,
        'en-US': en
    }
});

export default i18n;