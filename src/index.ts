import { PDFParse } from './PDFParse.js';

export type TypedArray = Int8Array | Uint8Array | Uint8ClampedArray | Int16Array | Uint16Array | Int32Array | Uint32Array | Float32Array | Float64Array;
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

export async function pdf(data: string | URL | number[] | ArrayBuffer | TypedArray) {
	let parser: PDFParse;
	if (data instanceof URL) {
		parser = new PDFParse({ url: data });
	} else {
		parser = new PDFParse({ data });
	}

	const text = await parser.GetText();
	return text;
}

export { PDFParse };
