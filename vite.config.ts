import { defineConfig } from 'vite';

export default defineConfig({
	build: {
		outDir: 'dist/browser',
		emptyOutDir: false,
		lib: {
			entry: 'src/index.ts',
			name: 'PdfParse',
			// Add .min to filename if minifying
			fileName: (format) => (process.env.MINIFY === 'true' ? `pdf-parse.${format}.min.js` : `pdf-parse.${format}.js`),
			formats: ['es', 'cjs', 'umd'],
		},
	},
});
