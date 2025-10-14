/// <reference types="vite/client" />
import * as WorkerUrl from 'pdfjs-dist/legacy/build/pdf.worker.mjs?url';

export function getWorkerSource() {
	return WorkerUrl.default;
}
