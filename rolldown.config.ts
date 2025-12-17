import { cp } from 'node:fs/promises';
import { defineConfig } from 'rolldown';
import { dts } from 'rolldown-plugin-dts';

function copyPlugin() {
	return {
		name: 'copy-plugin',
		async writeBundle() {
			await cp(`temp/pdf-parse-types/index.d.ts`, 'dist/pdf-parse.d.ts');
			await cp(`temp/pdf-parse-types/index.d.ts`, 'dist/pdf-parse.d.cts');
			await cp(`temp/pdf-parse-types/index.d.ts.map`, 'dist/pdf-parse.d.ts.map');
			await cp(`temp/pdf-parse-types/index.d.ts.map`, 'dist/pdf-parse.d.cts.map');
		},
	};
}

const config = defineConfig([
	{
		logLevel: 'warn',
		input: ['./src/pdf-parse/index.ts'],
		plugins: [dts({ emitDtsOnly: true, resolve: true, resolver: 'tsc' }), copyPlugin()],
		tsconfig: 'tsconfig.json',
		platform: 'browser',

		output: {
			dir: 'temp/pdf-parse-types',
			cleanDir: true,
			format: 'es',
			inlineDynamicImports: false,
			entryFileNames: '[name].js',
			chunkFileNames: '[name]-[hash].js',
		},
	},
]);

export default config;
