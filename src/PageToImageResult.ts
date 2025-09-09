import type { InfoResult } from './InfoResult';

export interface PageToImageResult extends InfoResult {
	pages: PageToImage[];
}

export interface PageToImage {
	// Raw binary image data (PNG/JPEG) normalized to Uint8Array.
	data: Uint8Array;

	// Optional base64 data URL for easy embedding in HTML.
	dataUrl: string;

	pageNumber: number;
}
