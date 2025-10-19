import { defineConfig } from 'vite';

export default defineConfig({
	build: {
		outDir: 'dist/pdf-parse/cjs',
		emptyOutDir: false,
		sourcemap: true,
		minify: 'terser',
		lib: {
			entry: 'src/pdf-parse/index.ts',
			name: 'PdfParse',
			fileName: 'index',
			formats: ['cjs'],
		},
	},
});
