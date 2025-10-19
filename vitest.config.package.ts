import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		environment: 'node',
		slowTestThreshold: 1000,
		globals: true,
		include: ['tests/unit/**/*.test.ts'],
		exclude: ['tests/unit/**/_*', 'tests/unit/_**/*'],
		reporters: ['default'],
	},
});
