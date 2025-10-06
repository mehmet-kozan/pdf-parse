import type { TypedArray } from './DocumentInitParameters.js';
import { PDFParse } from './PDFParse.js';

export type { DocumentInitParameters, PDFDataRangeTransport, PDFWorker, TypedArray } from './DocumentInitParameters.js';
export type { EmbeddedImage, ImageKindKey, ImageKindValue, ImageResult, PageImages } from './ImageResult.js';
export type { InfoResult } from './InfoResult.js';
export type { PageToImage, PageToImageResult } from './PageToImageResult.js';
export type { PageTableResult, TableResult } from './TableResult.js';
export type { PageTextResult, TextResult } from './TextResult.js';

async function pdf(data: string | URL | number[] | ArrayBuffer | TypedArray) {
	let parser: PDFParse;
	if (data instanceof URL) {
		parser = new PDFParse({ url: data });
	} else {
		parser = new PDFParse({ data });
	}

	const text = await parser.getText();
	return text;
}

pdf.PDFParse = PDFParse;
pdf.pdf = pdf;

export default pdf;
