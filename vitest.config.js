import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		environment: 'node',
		globals: true,
		threads: false,
		exclude: ['**/node_modules/**', '**/dist/**', '**/_*', '**/_*.test.*', '**/_*.spec.*'],
		reporters: ['default', 'html'],
		outputFile: {
			html: 'reports/test-report/index.html',
		},

		coverage: {
			enabled: true,
			provider: 'v8',
			include: ['src/**/*.ts'],
			exclude: ['src/**/*.d.ts', 'src/types/**', 'src/index.cjs.ts'],
			reporter: [['html', { subdir: 'html-report' }], 'lcov', 'json', 'text-summary'],
			reportsDirectory: 'reports/coverage',
			all: true, // Include all files, even if not tested
			clean: false, // Clean coverage directory before generating new report
		},

		benchmark: {
			reporters: ['verbose', 'html'],
			outputFile: {
				html: 'reports/benchmark/index.html',
			},
		},
	},
});
