import { copyFileSync } from 'node:fs';
import { join } from 'node:path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
	plugins: [
		dts({
			outDir: 'dist/cjs', // Match your build outDir
			insertTypesEntry: false, // Optional: Adds types entry to package.json
			exclude: ['dist', 'example', 'lib/**/*', 'test/**/*', 'src/**/_*', 'src/_**/*', 'src/index.ts'],
		}),
		{
			name: 'copy-pdf-worker',
			closeBundle() {
				const source = join(process.cwd(), 'node_modules', 'pdfjs-dist', 'legacy', 'build', 'pdf.worker.mjs');
				const dest = join(process.cwd(), 'dist', 'cjs', 'pdf.worker.mjs');
				copyFileSync(source, dest);
			},
		},
	],
	build: {
		outDir: 'dist/cjs',
		emptyOutDir: false,
		sourcemap: true,
		minify: false,
		lib: {
			entry: 'src/index.cjs.ts',
			name: 'PdfParse',
			fileName: () => `index.cjs`,
			formats: ['cjs'],
		},
	},
});
