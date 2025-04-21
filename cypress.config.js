import { defineConfig } from 'cypress';

export default defineConfig({
    e2e: {
        supportFile: false,
        specPattern: 'cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}',
        baseUrl: 'http://localhost:5173',
    },
});
