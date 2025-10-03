import type { InfoResult } from './InfoResult.js';

export interface TextResult extends InfoResult {
	pages: Array<PageTextResult>;
	text: string;

	getPageText(num: number): string;
}

interface PageTextResult {
	num: number;
	text: string;
}

export const TextResultDefault: TextResult = {
	getPageText(num: number): string {
		for (const pageData of this.pages) {
			if (pageData.num === num) return pageData.text;
		}
		return '';
	},
	pages: [],
	total: 0,
	text: '',
	info: undefined,
	metadata: undefined,
};
