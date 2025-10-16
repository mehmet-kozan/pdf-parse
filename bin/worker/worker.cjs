const { join } = require('node:path');
const { DOMMatrix, ImageData, Path2D } = require('@napi-rs/canvas');

// Wrap the await in an async IIFE to fix the top-level await issue in CommonJS
(async () => {
	await import('pdfjs-dist/legacy/build/pdf.worker.mjs');
	// Use workerModule here if needed
})();

const { getWorkerSource } = require('./worker_source.cjs');

globalThis.DOMMatrix = DOMMatrix;
globalThis.Path2D = Path2D;
globalThis.ImageData = ImageData;

/**
 * Gets the absolute path to the PDF worker file.
 *
 * @returns {string} The absolute path to the PDF worker module (pdf.worker.mjs)
 */
function getWorkerPath() {
	return join(__dirname, '../../dist/cjs/pdf.worker.mjs');
}

// const loader = async () => {
// 	const worker = await import(this.workerSrc);
// 	return worker.WorkerMessageHandler;
// };
// loader();

exports.getWorkerPath = getWorkerPath;
exports.getWorkerSource = getWorkerSource;
