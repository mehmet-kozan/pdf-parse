import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		environment: 'node',
		globals: true,
		threads: false,
		exclude: ['**/node_modules/**', '**/dist/**', '**/_*', '**/_*.test.*', '**/_*.spec.*'],
		reporters: ['default', ['html', { outputFile: './reports/test/index.html' }]],
		coverage: {
			enabled: true,
			provider: 'v8',
			include: ['src/**/*.ts'],
			exclude: ['src/**/*.d.ts', 'src/types/**', 'src/index.cjs.ts'],
			reporter: ['html'],
			reportsDirectory: './reports/coverage',
			all: true, // Include all files, even if not tested
			clean: true, // Clean coverage directory before generating new report
		},
	},
});
