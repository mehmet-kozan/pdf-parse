import { defineConfig } from 'vite';

export default defineConfig({
	build: {
		outDir: 'dist/node',
		emptyOutDir: false,
		sourcemap: true,
		minify: false,
		lib: {
			entry: 'src/index.ts',
			name: 'PdfParse',
			fileName: 'index',
			formats: ['cjs'],
		},
	},
});
