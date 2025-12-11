/// <reference types="vite/client" />
import * as WorkerUrl from 'pdfjs-dist/legacy/build/pdf.worker.min.mjs?url';

import { PDFParse } from './index.js';

PDFParse.setWorker(WorkerUrl.default);

export type * from './index.js';
export * from './index.js';
