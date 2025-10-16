import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DOMMatrix, ImageData, Path2D } from '@napi-rs/canvas';
import 'pdfjs-dist/legacy/build/pdf.worker.mjs';

export { getWorkerSource } from './worker_source.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// process.getBuiltinModule is not a function
//if (!process.getBuiltinModule) {
globalThis.DOMMatrix = DOMMatrix;
globalThis.Path2D = Path2D;
globalThis.ImageData = ImageData;
//globalThis.Image = Image;
//}

/**
 * Gets the absolute path to the PDF worker file.
 *
 * @returns {string} The absolute path to the PDF worker module (pdf.worker.mjs)
 */
export function getWorkerPath() {
	return join(__dirname, '../../dist/esm/pdf.worker.mjs');
}
