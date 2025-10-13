import { PDFParse } from './PDFParse.js';

export { VerbosityLevel } from 'pdfjs-dist/legacy/build/pdf.mjs';

export type { DocumentInitParameters, PDFDataRangeTransport, PDFWorker, TypedArray } from 'pdfjs-dist/types/src/display/api.js';
export { getHeader, type HeaderResult } from './HeaderResult.js';
export type { EmbeddedImage, ImageKindKey, ImageKindValue, ImageResult, PageImages } from './ImageResult.js';
export type { DateNode, InfoResult, Metadata, OutlineNode, PageLinkResult } from './InfoResult.js';
export type { ParseParameters } from './ParseParameters.js';
export type { Screenshot, ScreenshotResult } from './ScreenshotResult.js';
export type { PageTableResult, TableResult } from './TableResult.js';
export type { PageTextResult, TextResult } from './TextResult.js';

/**
 * The URL of the PDF.
 * -
 * Binary PDF data.
 * Use TypedArrays (Uint8Array) to improve the memory usage. If PDF data is
 * BASE64-encoded, use `atob()` to convert it to a binary string first.
 * https://mozilla.github.io/pdf.js/examples/
 *
 * NOTE: If TypedArrays are used they will generally be transferred to the
 * worker-thread. This will help reduce main-thread memory usage, however
 * it will take ownership of the TypedArrays.
 */

export { PDFParse };
