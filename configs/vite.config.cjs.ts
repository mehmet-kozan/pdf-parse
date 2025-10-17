import { defineConfig } from 'vite';

export default defineConfig({
	build: {
		outDir: 'dist/cjs',
		emptyOutDir: false,
		sourcemap: true,
		minify: 'terser',
		lib: {
			entry: 'src/index.ts',
			name: 'PdfParse',
			fileName: 'index',
			formats: ['cjs'],
		},
	},
});
