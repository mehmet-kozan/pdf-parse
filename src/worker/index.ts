/** biome-ignore-all lint/suspicious/noConsole: error dedection */
import path from 'node:path';
import { fileURLToPath } from 'node:url';

let runtimeDirname: string;

if (typeof __dirname !== 'undefined') {
	runtimeDirname = __dirname;
} else {
	// ESM ortamı
	const __filename = fileURLToPath(import.meta.url);
	runtimeDirname = path.dirname(__filename);
}

(async () => {
	try {
		await import('pdfjs-dist/legacy/build/pdf.worker.mjs');
		//console.log('pdf.worker loaded.\n');
	} catch (err) {
		console.error('pdf.worker load error!..\n', err);
		// fallback veya graceful degradation
	}
})();

// @ts-expect-error: importing worker as data URL via esbuild query parameter
import DataUrl from 'pdfjs-dist/legacy/build/pdf.worker.min.mjs?dataurl';

export function getData(): string {
	return DataUrl;
}

export { CanvasFactory } from './canvas.js';

export function getPath(): string {
	return path.resolve(runtimeDirname, '../pdf.worker.mjs');
}
