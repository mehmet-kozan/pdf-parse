#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as esbuild from 'esbuild';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataUrlPlugin = {
	name: 'dataurl-plugin',
	setup(build) {
		// Resolve imports that end with ?dataurl
		build.onResolve({ filter: /\?dataurl$/ }, (args) => {
			const without = args.path.replace(/\?dataurl$/, '');
			const resolvedPath = path.resolve(__dirname, '../node_modules', without);
			return { path: resolvedPath, namespace: 'dataurl' };
		});

		// Load the resolved file and convert to a data URL
		build.onLoad({ filter: /.*/, namespace: 'dataurl' }, async (args) => {
			const filePath = args.path;
			const buffer = fs.readFileSync(filePath);
			const dataUrl = `data:text/javascript;base64,${buffer.toString('base64')}`;
			return { contents: `export default ${JSON.stringify(dataUrl)};`, loader: 'js' };
		});
	},
};

// Run esbuild with sensible defaults for the project
(async () => {
	try {
		await esbuild.build({
			entryPoints: [path.resolve(process.cwd(), 'src/worker/index.ts')],
			bundle: true,
			platform: 'node',
			format: 'cjs',
			target: ['node16'],
			outfile: path.resolve(process.cwd(), 'dist/worker/cjs/index.cjs'),
			sourcemap: false,
			external: ['@napi-rs/*'],
			loader: { '.node': 'file' },
			plugins: [dataUrlPlugin],
		});
		// keep simple feedback for CLI users
		process.stdout.write('worker build finished\n');
	} catch (err) {
		process.stderr.write(`${String(err)}\n`);
		process.exit(1);
	}
})();
