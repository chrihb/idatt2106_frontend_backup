import { defineConfig } from 'cypress';
import codeCoverageTask from '@cypress/code-coverage/task.js'

export default defineConfig({
    e2e: {
        setupNodeEvents(on, config) {
            codeCoverageTask(on, config)
            return config
          },
        supportFile: 'cypress/support/e2e.js',
        specPattern: 'cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}',
        baseUrl: 'http://localhost:5173',
    },
});
