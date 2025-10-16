import { defineConfig } from 'vite';

export default defineConfig({
	build: {
		outDir: 'dist/cjs',
		emptyOutDir: false,
		sourcemap: true,
		minify: false,
		lib: {
			entry: 'src/index.ts',
			name: 'PdfParse',
			fileName: 'index',
			formats: ['cjs'],
		},
		rollupOptions: {},
		// https://github.com/rollup/plugins/tree/master/packages/commonjs#options
		commonjsOptions: {
			sourceMap: true,
		},
	},
});
