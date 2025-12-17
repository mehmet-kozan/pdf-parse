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
			entry: 'src/node/index.ts',
			name: 'PdfParse',
			fileName: (format) => {
				if (format === 'es') {
					return 'pdf-parse-node.js';
				} else if (format === 'cjs') {
					return 'pdf-parse-node.cjs';
				}

				return `pdf-parse-node.${format}`;
			},
			formats: ['es', 'cjs'],
		},
		rollupOptions: { external: ['node:http', 'node:https'] },
	},
});
