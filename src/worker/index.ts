/** biome-ignore-all lint/suspicious/noConsole: error dedection */
import { resolve } from 'node:path';

(async () => {
	try {
		await import('pdfjs-dist/legacy/build/pdf.worker.mjs');
		console.log('pdf.worker loaded.\n');
	} catch (err) {
		console.error('pdf.worker load error:\n', err);
		// fallback veya graceful degradation
	}
})();

// @ts-expect-error: importing worker as data URL via esbuild query parameter
import DataUrl from 'pdfjs-dist/legacy/build/pdf.worker.min.mjs?dataurl';

export function getDataUrl(): string {
	return DataUrl;
}

export { CanvasFactory } from './canvas.js';

export function getPath(): string {
	return resolve(__dirname, '../pdf.worker.mjs');
}
