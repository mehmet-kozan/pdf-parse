/** biome-ignore-all lint/suspicious/noConsole: error dedection */
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// // @ts-expect-error: importing worker as data URL via esbuild query parameter
// import { WorkerMessageHandler } from 'pdfjs-dist/legacy/build/pdf.worker.min.mjs';

// (global as any).pdfjsWorker = { WorkerMessageHandler };

// export { WorkerMessageHandler };

(async () => {
	try {
		// @ts-expect-error: importing worker
		await import('pdfjs-dist/legacy/build/pdf.worker.mjs');
		//console.log('pdf.worker loaded.\n');
	} catch (err) {
		console.error('pdf.worker load error!..\n', err);
		// fallback veya graceful degradation
	}
})();

// import DataUrl from 'pdfjs-dist/legacy/build/pdf.worker.min.mjs?url';

// export function getData(): string {
// 	return DataUrl;
// }

export { CanvasFactory } from './canvas.js';

export function getPath(): string {
	if (typeof __dirname !== 'undefined') {
		// CJS
		return path.resolve(__dirname, 'pdf.worker.cjs');
	} else {
		// ESM
		const __filename = fileURLToPath(import.meta.url);
		return path.resolve(path.dirname(__filename), 'pdf.worker.js');
	}
}

export function getMainPath(): string {
	if (typeof __dirname !== 'undefined') {
		// CJS
		return path.resolve(__dirname, 'pdf.worker.mjs');
	} else {
		// ESM
		const __filename = fileURLToPath(import.meta.url);
		return path.resolve(path.dirname(__filename), 'pdf.worker.mjs');
	}
}

export function getData(): string {
	return getPath();
}
