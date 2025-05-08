import { createI18n } from 'vue-i18n'
import en from '@/locales/en-US.json'
import nb from '@/locales/nb-NO.json'

const savedLocale = localStorage.getItem('locale') || 'nb-NO';

const i18n = createI18n({
    legacy: false,
    locale: savedLocale,
    fallbackLocale: 'nb-NO',
    messages: {
        'nb-NO': nb,
        'en-US': en
    }
});

export default i18n;