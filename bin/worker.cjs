const { join } = require('node:path');

/**
 * Gets the absolute path to the PDF worker file.
 *
 * @returns {string} The absolute path to the PDF worker module (pdf.worker.mjs)
 */
function getPath() {
	return join(__dirname, '../dist/node/pdf.worker.mjs');
}

exports.getPath = getPath;
