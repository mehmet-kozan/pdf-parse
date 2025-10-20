import { cpSync } from 'node:fs';
import { basename, join } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
	build: {
		outDir: 'dist/pdf-parse/web',
		emptyOutDir: true,
		sourcemap: true,
		minify: 'terser',
		lib: {
			entry: 'src/pdf-parse/index.ts',
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
				const dest_web = join(cwd, 'dist/pdf-parse/web/');
				const dest_esm = join(cwd, 'dist/pdf-parse/esm/');
				const dest_cjs = join(cwd, 'dist/pdf-parse/cjs/');
				const dest_worker = join(cwd, 'dist/worker/');

				cpSync(source, join(dest_web, basename(source)));
				cpSync(source_map, join(dest_web, basename(source_map)));

				cpSync(source_min, join(dest_esm, 'pdf.worker.mjs'));
				cpSync(source_min, join(dest_cjs, 'pdf.worker.mjs'));
				cpSync(source_min, join(dest_worker, 'pdf.worker.mjs'));
				cpSync(join(dest_cjs, 'index.d.cts'), join(dest_web, 'pdf-parse.es.d.ts'));
			},
		},
		{
			name: 'copy-dist-to-reports',
			closeBundle() {
				const source = join(process.cwd(), 'dist/pdf-parse/web');
				const dest = join(process.cwd(), 'reports/demo/dist-web');
				cpSync(source, dest, { recursive: true });
			},
		},
	],
});
