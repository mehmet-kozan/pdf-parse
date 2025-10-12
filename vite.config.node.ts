import { defineConfig } from 'vite';
//import dts from 'vite-plugin-dts';

export default defineConfig({
	build: {
		outDir: 'dist/node',
		emptyOutDir: false,
		sourcemap: true,
		minify: false,
		lib: {
			entry: 'src/index.ts',
			name: 'PdfParse',
			fileName: 'index',
			formats: ['cjs'],
		},
	},
	// plugins: [
	// 	dts({
	// 		outDir: 'dist/node',
	// 		//insertTypesEntry: false, // Optional: Adds types entry to package.json
	// 		//include: ['src/**/*'],
	// 		rollupTypes: false,
	// 		tsconfigPath: './tsconfig.node.json',
	// 		copyDtsFiles: true,
	// 		logLevel: 'warn',
	// 		//exclude: ['dist', 'example', 'lib/**/*', 'test/**/*', 'src/**/_*', 'src/_**/*'],
	// 	}),
	// ],
});
