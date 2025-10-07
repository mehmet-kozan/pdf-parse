import { copyFileSync, cpSync } from 'node:fs';
import { join } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
	build: {
		outDir: 'dist/browser',
		emptyOutDir: false,
		sourcemap: false,
		minify: true,
		lib: {
			entry: 'src/index.ts',
			name: 'PdfParse',
			fileName: (format) => `pdf-parse.${format}.min.js`,
			formats: ['es', 'umd'],
		},
	},
	plugins: [
		{
			name: 'copy-pdf-worker',
			closeBundle() {
				const source = join(process.cwd(), 'node_modules', 'pdfjs-dist', 'legacy', 'build', 'pdf.worker.min.mjs');
				const dest = join(process.cwd(), 'dist', 'browser', 'pdf.worker.min.mjs');
				copyFileSync(source, dest);
			},
		},
		{
			name: 'copy-dist-to-github-pages',
			closeBundle() {
				const source = join(process.cwd(), 'dist', 'browser');
				const dest = join(process.cwd(), 'gh-pages', 'demo', 'dist-browser');
				cpSync(source, dest, { recursive: true });
			},
		},
	],
});
