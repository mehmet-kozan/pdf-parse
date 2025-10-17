import { cpSync } from 'node:fs';
import { basename, join } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
	build: {
		outDir: 'dist/browser',
		emptyOutDir: true,
		sourcemap: true,
		minify: 'terser',
		lib: {
			entry: 'src/index.browser.ts',
			name: 'PdfParse',
			fileName: (format) => `pdf-parse.${format}.js`,
			formats: ['es', 'umd'],
		},
	},
	plugins: [
		{
			name: 'copy-pdf-worker',
			closeBundle() {
				const cwd = process.cwd();
				const source = join(cwd, 'node_modules/pdfjs-dist/legacy/build', 'pdf.worker.mjs');
				const source_min = join(cwd, 'node_modules/pdfjs-dist/legacy/build', 'pdf.worker.min.mjs');
				const source_map = join(cwd, 'node_modules/pdfjs-dist/legacy/build', 'pdf.worker.mjs.map');
				const dest_browser = join(cwd, 'dist/browser/');
				const dest_esm = join(cwd, 'dist/esm/');
				const dest_cjs = join(cwd, 'dist/cjs/');

				cpSync(source, join(dest_browser, basename(source)));
				cpSync(source_map, join(dest_browser, basename(source_map)));

				cpSync(source_min, join(dest_esm, 'pdf.worker.mjs'));
				cpSync(source_min, join(dest_cjs, 'pdf.worker.mjs'));
				cpSync(join(dest_cjs, 'index.d.cts'), join(dest_browser, 'pdf-parse.es.d.ts'));
			},
		},
		{
			name: 'copy-dist-to-reports',
			closeBundle() {
				const source = join(process.cwd(), 'dist/browser');
				const dest = join(process.cwd(), 'reports/demo/dist-browser');
				cpSync(source, dest, { recursive: true });
			},
		},
	],
});
