import type { ImageKind } from 'pdfjs-dist/legacy/build/pdf.mjs';
import type { InfoResult } from './InfoResult';

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

/**
 * ImageResult
 * - Main result type for image extraction.
 * - Extends InfoResult and contains an array of PageImages.
 */
export interface ImageResult extends InfoResult {
	pages: PageImages[];
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
 * - data: Raw image data as Uint8Array.
 * - fileName: Suggested file name or resource name for the image.
 * - width, height: Image dimensions in pixels.
 * - kind: ImageKindValue indicating the image's color format.
 */
export interface EmbeddedImage {
	data: Uint8Array;
	fileName: string;
	width: number;
	height: number;
	kind: ImageKindValue;
}
