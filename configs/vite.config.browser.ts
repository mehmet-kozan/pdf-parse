import { defineConfig } from 'vite';

export default defineConfig({
	build: {
		outDir: 'dist/browser',
		emptyOutDir: false,
		sourcemap: true,
		minify: false,
		lib: {
			entry: 'src/index.browser.ts',
			name: 'PdfParse',
			fileName: (format) => `pdf-parse.${format}.js`,
			formats: ['es', 'umd'],
		},
	},
});
