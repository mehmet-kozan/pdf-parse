// check: https://rclayton.silvrback.com/easy-class-api-options-with-typescript-and-joi

import type { DocumentInitParameters } from 'pdfjs-dist/types/src/display/api.js';

export interface ParseOptions extends DocumentInitParameters {
	partial?: boolean;
	first?: number;
	last?: number;
}
