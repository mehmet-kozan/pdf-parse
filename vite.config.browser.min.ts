import { copyFileSync, cpSync } from 'node:fs';
import { join } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
	build: {
		outDir: 'dist/browser',
		emptyOutDir: false,
		sourcemap: false,
		minify: 'terser',
		lib: {
			entry: 'src/index.browser.ts',
			name: 'PdfParse',
			fileName: (format) => `pdf-parse.${format}.min.js`,
			formats: ['es', 'umd'],
		},
	},
	plugins: [
		{
			name: 'copy-pdf-worker',
			closeBundle() {
				const source = join(process.cwd(), 'node_modules', 'pdfjs-dist', 'legacy', 'build', 'pdf.worker.mjs');
				const source_min = join(process.cwd(), 'node_modules', 'pdfjs-dist', 'legacy', 'build', 'pdf.worker.min.mjs');
				const dest_browser = join(process.cwd(), 'dist', 'browser', 'pdf.worker.mjs');
				const dest_browser_min = join(process.cwd(), 'dist', 'browser', 'pdf.worker.min.mjs');
				const dest_esm = join(process.cwd(), 'dist', 'esm', 'pdf.worker.mjs');
				const dest_cjs = join(process.cwd(), 'dist', 'cjs', 'pdf.worker.mjs');
				copyFileSync(source, dest_browser);
				copyFileSync(source_min, dest_browser_min);
				copyFileSync(source, dest_esm);
				copyFileSync(source, dest_cjs);
			},
		},
		{
			name: 'copy-dist-to-report_site',
			closeBundle() {
				const source = join(process.cwd(), 'dist', 'browser');
				const dest = join(process.cwd(), 'reports', 'demo', 'dist-browser');
				cpSync(source, dest, { recursive: true });
			},
		},
	],
});
