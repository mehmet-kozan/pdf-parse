const { join } = require('node:path');
const { CustomCanvasFactory } = require('../canvas/canvas.cjs');
const { getWorkerSource } = require('./worker_source.cjs');

(async () => {
	await import('pdfjs-dist/legacy/build/pdf.worker.mjs');
})();

function getWorkerPath() {
	return join(__dirname, '../../dist/cjs/pdf.worker.mjs');
}

exports.getWorkerPath = getWorkerPath;
exports.getWorkerSource = getWorkerSource;
exports.CustomCanvasFactory = CustomCanvasFactory;
