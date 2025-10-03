import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
	entries: ['./src/index'],
	outDir: 'dist/cjs',
	declaration: true,
	clean: true,
	failOnWarn: true,
	sourcemap: true,
	stub: false,

	rollup: {
		emitCJS: true,
		output: {
			format: 'cjs',
			entryFileNames: '[name].cjs',
			chunkFileNames: '[name].cjs',
		},
	},
});
