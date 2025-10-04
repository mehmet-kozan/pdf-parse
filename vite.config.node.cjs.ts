import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
	plugins: [
		dts({
			outDir: 'dist/cjs', // Match your build outDir
			insertTypesEntry: false, // Optional: Adds types entry to package.json
			exclude: ['dist', 'example', 'lib/**/*', 'test/**/*', 'src/**/_*', 'src/_**/*', 'src/index.ts'],
		}),
	],
	build: {
		outDir: 'dist/cjs',
		emptyOutDir: false,
		sourcemap: true,
		minify: false,
		lib: {
			entry: 'src/index.cjs.ts',
			name: 'PdfParse',
			fileName: () => `index.cjs`,
			formats: ['cjs'],
		},
	},
});
