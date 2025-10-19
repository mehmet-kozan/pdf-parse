import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		environment: 'node',
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
			include: ['src/pdf-parse/**/*.ts', 'src/node/**/*.ts', 'src/worker/**/*.ts'],
			exclude: ['src/**/_*', 'src/_**/*', 'src/worker/types/**'],
			reporter: [['html', { subdir: 'html-report' }], 'lcov', 'json', 'text-summary'],
			reportsDirectory: 'reports/coverage',
			all: true,
			clean: true,
		},

		benchmark: {
			include: ['tests/benchmark/*.bench.ts'],
			reporters: ['default'],
			outputJson: 'reports/benchmark/bench.json',
		},
	},
	resolve: {
		alias: {
			'pdf-parse/node': resolve(__dirname, 'src/node'),
			'pdf-parse/worker': resolve(__dirname, 'src/worker'),
			'pdf-parse': resolve(__dirname, 'src/pdf-parse'),
		},
	},
});
