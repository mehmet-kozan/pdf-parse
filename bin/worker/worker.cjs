const { join } = require('node:path');
const { DOMMatrix, ImageData, Path2D } = require('@napi-rs/canvas');
//require('pdfjs-dist/legacy/build/pdf.worker.mjs');

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
	return join(__dirname, '../../dist/node/pdf.worker.mjs');
}

// const loader = async () => {
// 	const worker = await import(this.workerSrc);
// 	return worker.WorkerMessageHandler;
// };
// loader();

exports.getWorkerPath = getWorkerPath;
exports.getWorkerSource = getWorkerSource;
