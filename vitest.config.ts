import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		environment: '',
		slowTestThreshold: 1000,
		globals: true,
		include: ['tests/unit/**/*.test.ts'],
		exclude: ['tests/unit/**/_*', 'tests/unit/_**/*'],
		reporters: ['default', 'html'],
		outputFile: {
			html: 'reports/test/index.html',
		},

		coverage: {
			enabled: false,
			provider: 'v8',
			include: ['src/**/*.ts', 'dist/esm/*.js'],
			exclude: ['src/**/_*', 'src/_**/*'],
			reporter: [['html', { subdir: 'html-report' }], 'lcov', 'json', 'text-summary'],
			reportsDirectory: 'reports/coverage',
			all: true,
			clean: true,
		},

		benchmark: {
			reporters: ['default'],
			outputJson: 'reports/benchmark/bench.json',
		},
	},
	resolve: {
		alias: {
			'pdf-parse': resolve(__dirname, './src'),
		},
	},
});
