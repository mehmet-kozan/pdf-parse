import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export { CustomCanvasFactory } from '../canvas/canvas.js';

import 'pdfjs-dist/legacy/build/pdf.worker.mjs';

export { getWorkerSource } from './worker_source.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function getWorkerPath() {
	return join(__dirname, '../../dist/esm/pdf.worker.mjs');
}
