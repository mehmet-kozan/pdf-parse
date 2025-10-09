import type { TypedArray } from './DocumentInitParameters.js';
import { PDFParse, setWorker } from './PDFParse.js';

export type { DocumentInitParameters, PDFDataRangeTransport, PDFWorker, TypedArray } from './DocumentInitParameters.js';
export type { EmbeddedImage, ImageKindKey, ImageKindValue, ImageResult, PageImages } from './ImageResult.js';
export type { DateNode, InfoResult, Metadata, OutlineNode, PageLinkResult } from './InfoResult.js';
export type { PageToImage, PageToImageResult } from './PageToImageResult.js';
export type { PageTableResult, TableResult } from './TableResult.js';
export type { PageTextResult, TextResult } from './TextResult.js';

/**
 * The URL of the PDF.
 * -
 * Binary PDF data.
 * Use TypedArrays (Uint8Array) to improve the memory usage. If PDF data is
 * BASE64-encoded, use `atob()` to convert it to a binary string first.
 *
 * NOTE: If TypedArrays are used they will generally be transferred to the
 * worker-thread. This will help reduce main-thread memory usage, however
 * it will take ownership of the TypedArrays.
 */

async function pdf(data: string | URL | number[] | ArrayBuffer | TypedArray) {
	let parser: PDFParse;
	if (data instanceof URL) {
		parser = new PDFParse({ url: data });
	} else {
		parser = new PDFParse({ data });
	}

	const text = await parser.getText();
	await parser.destroy();
	return text;
}

export { pdf, PDFParse, setWorker };
