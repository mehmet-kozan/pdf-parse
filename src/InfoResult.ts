import type { Metadata } from 'pdfjs-dist/types/src/display/metadata.js';

export type { Metadata } from 'pdfjs-dist/types/src/display/metadata.js';

export interface InfoResult {
	total: number;
	info?: object;
	metadata?: Metadata;
}
