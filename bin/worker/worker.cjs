const { join } = require('node:path');
require('@napi-rs/canvas');
require('pdfjs-dist/legacy/build/pdf.worker.mjs');
const { getWorkerSource } = require('./worker_source.cjs');

/**
 * Gets the absolute path to the PDF worker file.
 *
 * @returns {string} The absolute path to the PDF worker module (pdf.worker.mjs)
 */
function getWorkerPath() {
	return join(__dirname, '../../dist/node/pdf.worker.mjs');
}

exports.getWorkerPath = getWorkerPath;
exports.getWorkerSource = getWorkerSource;
