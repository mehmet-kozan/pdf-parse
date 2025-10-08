import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		environment: 'node',
		timeout: 10000,
		slowTestThreshold: 1000,
		globals: true,
		threads: false,
		exclude: ['**/node_modules/**', '**/dist/**', '**/_*', '**/_*.test.*', '**/_*.spec.*', '**/test_ava/**', '**/test_integration/**'],
		reporters: ['default', 'html'],
		clean: true,
		outputFile: {
			html: 'gh-pages/test-report/index.html',
		},

		coverage: {
			enabled: false,
			provider: 'v8',
			include: ['src/**/*.ts'],
			exclude: ['src/**/*.d.ts', 'src/types/**', 'src/index.cjs.ts'],
			reporter: [['html', { subdir: 'html-report' }], 'lcov', 'json', 'text-summary'],
			reportsDirectory: 'gh-pages/coverage',
			all: true,
			clean: true,
		},

		benchmark: {
			reporters: ['default'],
			outputJson: 'gh-pages/benchmark/bench.json',
		},
	},
});
