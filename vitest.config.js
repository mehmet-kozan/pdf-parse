import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		environment: 'node',
		globals: true,
		threads: false,
		exclude: ['**/node_modules/**', '**/dist/**', '**/_*', '**/_*.test.*', '**/_*.spec.*'],
		coverage: {
			provider: 'v8',
			include: ['src/**/*.ts'],
			exclude: ['src/**/*.d.ts', 'src/types/**', 'src/index.cjs.ts'],
			reporter: ['text', 'json', 'html'],
			reportsDirectory: './coverage',
		},
	},
});
