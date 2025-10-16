import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		environment: 'node',
		slowTestThreshold: 1000,
		globals: true,
		root:'test',
		exclude: ['test/**/_*', 'test/_**/*'],
		reporters: ['default', 'html'],
		outputFile: {
			html: 'reports_site/test-report/index.html',
		},

		coverage: {
			enabled: false,
			provider: 'v8',
			include: ['src/**/*.ts'],
			exclude: ['src/**/_*', 'src/_**/*'],
			reporter: [['html', { subdir: 'html-report' }], 'lcov', 'json', 'text-summary'],
			reportsDirectory: 'reports_site/coverage',
			all: true,
			clean: true,
		},

		benchmark: {
			reporters: ['default'],
			outputJson: 'reports_site/benchmark/bench.json',
		},
	},
});
