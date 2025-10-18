import { resolve } from 'node:path';
import tsconfigPaths from 'vite-tsconfig-paths';
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
	plugins: [
		tsconfigPaths({
			root: __dirname,
			projects: ['tsconfig.json', 'configs/tsconfig.utils.json'],
		}),
	],

	// resolve: {
	// 	alias: {
	// 		'pdf-parse': resolve(__dirname, './src'),
	// 		'pdf-parse/utils': resolve(__dirname, './utils'),
	// 	},
	// },
});
