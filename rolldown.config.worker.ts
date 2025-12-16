import { cp } from 'node:fs/promises';
import { defineConfig } from 'rolldown';
import { dts } from 'rolldown-plugin-dts';

function copyPlugin() {
	return {
		name: 'copy-plugin',
		async writeBundle() {
			await cp(`temp/worker-types/index.d.ts`, 'dist/worker.d.ts');
			await cp(`temp/worker-types/index.d.ts`, 'dist/worker.d.cts');
			await cp(`temp/worker-types/index.d.ts.map`, 'dist/worker.d.ts.map');
			await cp(`temp/worker-types/index.d.ts.map`, 'dist/worker.d.cts.map');
		},
	};
}

const config = defineConfig([
	{
		logLevel: 'warn',
		input: ['./src/worker/index.ts'],
		plugins: [dts({ emitDtsOnly: true, resolve: true, resolver: 'tsc' }), copyPlugin()],
		tsconfig: 'tsconfig.worker.json',
		platform: 'node',

		output: {
			dir: 'temp/worker-types',
			cleanDir: true,
			format: 'es',
			inlineDynamicImports: false,
			entryFileNames: '[name].js',
			chunkFileNames: '[name]-[hash].js',
		},
	},
]);

export default config;
