import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
    plugins: [tsconfigPaths()],
    test: {
        globals: true, // We are using explicit imports in the test file provided, but this is good practice
        environment: 'node',
    },
});
