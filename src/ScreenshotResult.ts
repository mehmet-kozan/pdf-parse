export interface Screenshot {
	// Raw binary image data (PNG/JPEG) normalized to Uint8Array.
	data: Uint8Array;

	// Optional base64 data URL for easy embedding in HTML.
	dataUrl: string;

	pageNumber: number;

	width: number;
	height: number;
	scale: number;
}

export class ScreenshotResult {
	pages: Array<Screenshot> = [];
	total: number = 0;

	constructor(total: number) {
		this.total = total;
	}
}
