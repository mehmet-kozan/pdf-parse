import { defineConfig } from 'vite';

export default defineConfig({
	build: {
		outDir: 'dist/pdf-parse/deno',
		emptyOutDir: true,
		sourcemap: true,
		minify: false,
		target: 'deno',
		lib: {
			entry: 'src/pdf-parse/index.ts',
			name: 'PdfParse',
			fileName: () => `pdf-parse.js`,
			formats: ['es'],
		},
	},
});
