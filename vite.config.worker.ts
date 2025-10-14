import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
	build: {
		outDir: 'dist/worker',
		emptyOutDir: false,
		sourcemap: false,
		minify: false,
		target: 'es2022',
		lib: {
			entry: 'src_worker/index.ts',
			name: 'PdfParse',
			fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`,
			formats: ['es', 'cjs'],
		},
	},
	plugins: [
		dts({
			tsconfigPath: undefined, // tsconfig’tan include alma
			entryRoot: 'src_worker',
			outDir: 'dist/worker',
			include: ['src_worker/**/*.ts'], // sadece worker tipleri
			exclude: ['src/**', 'dist/**', 'test/**', 'node_modules/**'],
			insertTypesEntry: true,
			rollupTypes: false,
			compilerOptions: {
				declaration: true,
				emitDeclarationOnly: true,
				declarationMap: false,
				rootDir: 'src_worker',
				outDir: 'dist/worker',
			},
		}),
	],
});
