import type { ImageKind } from 'pdfjs-dist/legacy/build/pdf.mjs';

/**
 * ImageKindKey
 * - Represents the keys of the ImageKind enum (e.g. "GRAYSCALE_1BPP", "RGB_24BPP", "RGBA_32BPP").
 */
export type ImageKindKey = keyof typeof ImageKind;

/**
 * ImageKindValue
 * - Represents the numeric values of the ImageKind enum (e.g. 1, 2, 3).
 */
export type ImageKindValue = (typeof ImageKind)[ImageKindKey];

export class ImageResult {
	pages: Array<PageImages> = [];
	total: number = 0;

	public getPageImage(num: number, name: string): EmbeddedImage | null {
		for (const pageData of this.pages) {
			if (pageData.pageNumber === num) {
				for (const img of pageData.images) {
					if (img.fileName === name) {
						return img;
					}
				}
			}
		}
		return null;
	}

	constructor(total: number) {
		this.total = total;
	}
}

/**
 * PageImages
 * - Represents all embedded images found on a single PDF page.
 * - pageNumber: 1-based page index.
 * - images: Array of EmbeddedImage objects for this page.
 */
export interface PageImages {
	pageNumber: number;
	images: EmbeddedImage[];
}

/**
 * EmbeddedImage
 * - Normalized representation of an embedded image extracted from the PDF.
 * - `data`: Raw image bytes (e.g. PNG/JPEG) as Uint8Array. Use this for file writing or binary processing.
 * - `dataUrl`: Optional data URL (e.g. "data:image/png;base64,...") for directly embedding in <img> src.
 *   Storing both lets consumers choose the most convenient form; consider omitting one to save memory.
 * - `fileName`: Suggested filename or resource name for the image (used when saving to disk).
 * - `width` / `height`: Dimensions in pixels.
 * - `kind`: ImageKindValue from pdfjs-dist indicating the pixel format (e.g. GRAYSCALE_1BPP / RGB_24BPP / RGBA_32BPP).
 */
export interface EmbeddedImage {
	// Raw binary image data (PNG/JPEG) normalized to Uint8Array.
	data: Uint8Array;

	// Optional base64 data URL for easy embedding in HTML.
	dataUrl: string;

	// Suggested filename or resource identifier for the image.
	fileName: string;

	// Image dimensions in pixels.
	width: number;
	height: number;

	// Color format as defined by pdfjs ImageKind numeric values.
	kind: ImageKindValue;
}
