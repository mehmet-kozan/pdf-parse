import type { InfoResult, Metadata } from './InfoResult.js';

export interface PageToImage {
	// Raw binary image data (PNG/JPEG) normalized to Uint8Array.
	data: Uint8Array;

	// Optional base64 data URL for easy embedding in HTML.
	dataUrl: string;

	pageNumber: number;
}

export class PageToImageResult implements InfoResult {
	pages: Array<PageToImage> = [];
	total: number = 0;
	info?: object | undefined;
	metadata?: Metadata | undefined;

	constructor(info: InfoResult) {
		Object.assign(this, info);
	}
}
