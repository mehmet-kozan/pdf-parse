import { defineConfig } from 'vite';

export default defineConfig({
	build: {
		outDir: 'bin/worker',
		emptyOutDir: false,
		sourcemap: false,
		minify: false,
		lib: {
			entry: 'bin/worker/index.ts',
			name: 'PdfParse',
			fileName: (format) => `worker_source.${format === 'es' ? 'js' : 'cjs'}`,
			formats: ['es', 'cjs'],
		},
	},
});
