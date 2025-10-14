import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Gets the absolute path to the PDF worker file.
 *
 * @returns {string} The absolute path to the PDF worker module (pdf.worker.mjs)
 */
export function getPath() {
	return join(__dirname, '../dist/node/pdf.worker.mjs');
}
