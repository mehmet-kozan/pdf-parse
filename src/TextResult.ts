import type { InfoResult } from './InfoResult.js';

export interface PageTextResult {
	num: number;
	text: string;
}

export class TextResult implements InfoResult {
	pages: Array<PageTextResult> = [];
	text: string = '';
	total: number = 0;

	getPageText(num: number): string {
		for (const pageData of this.pages) {
			if (pageData.num === num) return pageData.text;
		}
		return '';
	}

	constructor(info: InfoResult) {
		Object.assign(this, info);
	}
}
