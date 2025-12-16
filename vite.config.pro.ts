import { defineConfig } from 'vite';

export default defineConfig({
	build: {
		outDir: 'dist',
		emptyOutDir: false,
		sourcemap: true,
		minify: false,
		target: 'baseline-widely-available',
		ssr: false,
		lib: {
			entry: 'src/pdf-parse-pro/index.ts',
			name: 'PdfParse',
			fileName: (format) => {
				if (format === 'es') {
					return 'pdf-parse-pro.js';
				} else if (format === 'umd') {
					return 'pdf-parse-pro.cjs';
				}

				return `pdf-parse-pro.${format}`;
			},
			formats: ['es', 'umd'],
		},
	},
});
