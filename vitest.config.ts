import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		environment: 'node',
		slowTestThreshold: 1000,
		globals: true,
		include: ['test/**/*.test.ts'],
		exclude: ['test/**/_*', 'test/_**/*'],
		reporters: ['default', 'html'],
		outputFile: {
			html: 'gh-pages/test-report/index.html',
		},

		coverage: {
			enabled: false,
			provider: 'v8',
			include: ['src/**/*.ts'],
			exclude: ['src/**/_*', 'src/_**/*'],
			reporter: [['html', { subdir: 'html-report' }], 'lcov', 'json', 'text-summary'],
			reportsDirectory: 'gh-pages/coverage',
			all: true,
			clean: true,
		},

		benchmark: {
			reporters: ['default'],
			outputJson: 'gh-pages/bench.json',
		},
	},
});
