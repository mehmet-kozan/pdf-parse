import * as WorkerUrl from 'pdfjs-dist/legacy/build/pdf.worker.mjs?url';

/**
 * Gets base64 data URL string for  worker pdf.worker.mjs script.
 * @returns {string} The worker base64 data URL string.
 */
export function getSource() {
	return WorkerUrl.default || WorkerUrl;
}
