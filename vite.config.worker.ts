import { defineConfig } from 'vite';

export default defineConfig({
	build: {
		outDir: 'dist',
		emptyOutDir: false,
		sourcemap: true,
		minify: false,
		target: 'node18',
		lib: {
			entry: 'src/worker2/index.ts',
			name: 'PdfParse',
			fileName: (format) => {
				if (format === 'es') {
					return 'pdf-parse-worker.js';
				} else if (format === 'cjs') {
					return 'pdf-parse-worker.cjs';
				}

				return `pdf-parse-worker.${format}`;
			},
		},

		rollupOptions: {
			external: ['@napi-rs/canvas', 'node:url', 'node:path'],

			output: [
				{
					format: 'es',
					chunkFileNames: '[name].js',

					manualChunks(id: string) {
						if (id.includes('pdfjs-dist/legacy/build/pdf.worker.mjs')) {
							return 'pdf.worker';
						}
					},
				},
				{
					format: 'cjs',
					chunkFileNames: '[name].cjs',

					manualChunks(id: string) {
						if (id.includes('pdfjs-dist/legacy/build/pdf.worker.mjs')) {
							return 'pdf.worker';
						}
					},
				},
			],
		},
	},
});
