import { defineConfig } from 'vite';

export default defineConfig({
	build: {
		outDir: 'dist',
		emptyOutDir: false,
		sourcemap: true,
		minify: true,
		target: 'node18',
		ssr: false,
		lib: {
			entry: 'src/worker/index.ts',
			name: 'PdfParse',
			fileName: (format) => {
				if (format === 'es') {
					return 'worker.js';
				} else if (format === 'cjs') {
					return 'worker.cjs';
				}

				return `worker.${format}`;
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
