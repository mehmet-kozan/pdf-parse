/** biome-ignore-all lint/suspicious/noConsole: build script */
import { cp } from 'node:fs/promises';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function copyPackageJson() {
	try {
		const src = join(__dirname, '..', 'configs', 'package.cjs.json');
		const mainDestDir = join(__dirname, '..', 'dist', 'pdf-parse', 'cjs');
		const mainDest = join(mainDestDir, 'package.json');

		await cp(src, mainDest);

		console.log(`Copied ${src} → ${mainDest}`);
	} catch (err) {
		console.error('Failed to copy package.cjs.json:', err);
		process.exitCode = 1;
	}
}

async function copyWorker() {
	try {
		const source = join(__dirname, '../node_modules/pdfjs-dist/legacy/build', 'pdf.worker.mjs');
		//const source_min = join(__dirname, '../node_modules/pdfjs-dist/legacy/build', 'pdf.worker.min.mjs');
		const source_map = join(__dirname, '../node_modules/pdfjs-dist/legacy/build', 'pdf.worker.mjs.map');

		const dest = join(__dirname, '../dist');

		// pdf-parse  build
		await cp(source, join(dest, basename(source)));
		//await cp(source_min, join(dest, basename(source_min)));
		await cp(source_map, join(dest, basename(source_map)));

		console.log(`Copied worker files`);
	} catch (err) {
		console.error('Failed to copy worker:', err);
		process.exitCode = 1;
	}
}

async function copyWebBuild() {
	try {
		const source = join(__dirname, '../dist/pdf-parse/web');
		const dest = join(__dirname, '../reports/demo/dist-web');

		await cp(source, dest, { recursive: true });

		console.log(`Copied web build`);
	} catch (err) {
		console.error('Failed to copy web build:', err);
		process.exitCode = 1;
	}
}

//await copyPackageJson();
await copyWorker();
//await copyWebBuild();
