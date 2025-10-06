import { defineConfig } from 'vitest/config';

export default defineConfig({
	base: '/pdf-parse/', // Use relative paths for GitHub Pages compatibility
	test: {
		environment: 'node',
		globals: true,
		threads: false,
		exclude: ['**/node_modules/**', '**/dist/**', '**/_*', '**/_*.test.*', '**/_*.spec.*'],
		reporters: [
			'default',
			[
				'html',
				{
					outputFile: './reports/test/index.html',
					summaryFile: '../coverage/coverage-summary.json',
				},
			],
		],
		coverage: {
			enabled: false,
			provider: 'v8',
			include: ['src/**/*.ts'],
			exclude: ['src/**/*.d.ts', 'src/types/**', 'src/index.cjs.ts'],
			reporter: ['html', 'json-summary', 'json'],
			reportsDirectory: './reports/coverage',
			all: true, // Include all files, even if not tested
			clean: true, // Clean coverage directory before generating new report
		},
	},
});
