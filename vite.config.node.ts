import { defineConfig } from 'vite';

export default defineConfig({
	build: {
		outDir: 'dist/pdf-parse/node',
		emptyOutDir: true,
		sourcemap: true,
		minify: false,
		target: 'node',
		lib: {
			entry: 'src/pdf-parse/index.ts',
			name: 'PdfParse',
			fileName: (format) => `pdf-parse.${format}`,
			formats: ['cjs'],
		},
	},
});
