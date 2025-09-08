import { defineConfig } from 'vite';

export default defineConfig({
	build: {
		outDir: 'dist/browser',
		lib: {
			entry: 'src/index.ts',
			name: 'PdfParse',
			fileName: (format) => `pdf-parse.${format}.js`,
			formats: ['es', 'cjs', 'umd'],
		},
	},
});
