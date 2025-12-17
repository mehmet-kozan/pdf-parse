import { cp } from 'node:fs/promises';
import { defineConfig } from 'rolldown';
import { dts } from 'rolldown-plugin-dts';

function copyPlugin() {
	return {
		name: 'copy-plugin',
		async writeBundle() {
			await cp(`temp/node-types/index.d.ts`, 'dist/node.d.ts');
			await cp(`temp/node-types/index.d.ts`, 'dist/node.d.cts');
			await cp(`temp/node-types/index.d.ts.map`, 'dist/node.d.ts.map');
			await cp(`temp/node-types/index.d.ts.map`, 'dist/node.d.cts.map');
		},
	};
}

const config = defineConfig([
	{
		logLevel: 'warn',
		input: ['./src/node/index.ts'],
		plugins: [dts({ emitDtsOnly: true, resolve: true, resolver: 'tsc' }), copyPlugin()],
		tsconfig: 'tsconfig.node.json',
		platform: 'node',

		output: {
			dir: 'temp/node-types',
			cleanDir: true,
			format: 'es',
			inlineDynamicImports: false,
			entryFileNames: '[name].js',
			chunkFileNames: '[name]-[hash].js',
		},
	},
]);

export default config;
