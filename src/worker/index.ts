import { resolve } from 'node:path';
// @ts-expect-error: importing worker as data URL via esbuild query parameter
import DataUrl from 'pdfjs-dist/legacy/build/pdf.worker.min.mjs?dataurl';

export function getDataUrl(): string {
	return DataUrl;
}

export { CanvasFactory } from './canvas.js';

export function getPath(): string {
	return resolve(__dirname, '../pdf.worker.js');
}
