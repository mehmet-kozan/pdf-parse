import { defineConfig } from 'vite';

export default defineConfig({
	build: {
		outDir: 'dist/worker',
		emptyOutDir: false,
		sourcemap: false,
		minify: false,
		lib: {
			entry: 'src_worker/index.ts',
			name: 'PdfParse',
			fileName: (format) => `source.${format === 'es' ? 'js' : 'cjs'}`,
			formats: ['es', 'cjs'],
		},
		rollupOptions: {
			output: {
				preserveModules: false,
				compact: false,
			},
		},
	},
	esbuild: false,
});
