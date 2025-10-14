import '@napi-rs/canvas';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import 'pdfjs-dist/legacy/build/pdf.worker.mjs';

export { getWorkerSource } from './worker_source.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Gets the absolute path to the PDF worker file.
 *
 * @returns {string} The absolute path to the PDF worker module (pdf.worker.mjs)
 */
export function getWorkerPath() {
	return join(__dirname, '../../dist/node/pdf.worker.mjs');
}
