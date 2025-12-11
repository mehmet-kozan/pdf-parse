import { defineConfig } from 'vite';

function fileName(format: string) {
	if (format === 'es') {
		return 'pdf-parse.js';
	} else if (format === 'cjs') {
		return 'pdf-parse.cjs';
	}

	return `pdf-parse.${format}`;
}

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
			fileName,
			formats: ['es', 'cjs'],
		},
	},
});
