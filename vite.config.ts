import { defineConfig } from 'vite';

export default defineConfig({
	build: {
		outDir: 'dist',
		emptyOutDir: false,
		sourcemap: true,
		minify: false,
		target: 'baseline-widely-available',

		lib: {
			entry: 'src/pdf-parse/index.ts',
			name: 'PdfParse',
			fileName: (format) => {
				if (format === 'es') {
					return 'pdf-parse.js';
				} else if (format === 'umd') {
					return 'pdf-parse.cjs';
				}

				return `pdf-parse.${format}`;
			},
			formats: ['es', 'umd'],
		},
	},
});
