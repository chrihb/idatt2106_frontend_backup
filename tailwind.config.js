const typography = require('@tailwindcss/typography')

module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
        colors: {
            'kf-blue': '#082e47',
            'kf-orange': '#fa7918',
            'kf-red': '#ed5035',
            'kf-white': '#ffffff',
            'kf-grey': '#e5e7eb',
        },
        typography: (theme) => ({
            kf: {
                css: {
                    '--tw-prose-body': theme('colors.kf-blue'),
                    '--tw-prose-headings': theme('colors.kf-blue'),
                    '--tw-prose-lead': theme('colors.kf-blue'),
                    '--tw-prose-links': theme('colors.kf-blue'),
                    '--tw-prose-bold': theme('colors.kf-blue'),
                    '--tw-prose-counters': theme('colors.kf-blue'),
                    '--tw-prose-bullets': theme('colors.kf-blue'),
                    '--tw-prose-hr': theme('colors.kf-blue'),
                    '--tw-prose-quotes': theme('colors.kf-blue'),
                    '--tw-prose-quote-borders': theme('colors.kf-blue'),
                    '--tw-prose-captions': theme('colors.kf-blue'),
                    '--tw-prose-code': theme('colors.kf-blue'),
                    '--tw-prose-pre-code': theme('colors.kf-blue'),
                    '--tw-prose-pre-bg': theme('colors.kf-grey'),
                    '--tw-prose-th-borders': theme('colors.kf-blue'),
                    '--tw-prose-td-borders': theme('colors.kf-blue'),
                    h1: { fontSize: '1.875rem !important', fontWeight: '700 !important' },
                    h2: { fontSize: '1.5rem !important', fontWeight: '600 !important' },
                }
            }
        }),
    },
  },
  plugins: [typography],
}
