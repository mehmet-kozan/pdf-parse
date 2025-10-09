export type HyperlinkPosition = { rect: { left: number; top: number; right: number; bottom: number }; url: string; text: string; used: boolean };

export interface PageTextResult {
	num: number;
	text: string;
}

export class TextResult {
	pages: Array<PageTextResult> = [];
	text: string = '';
	total: number = 0;

	public getPageText(num: number): string {
		for (const pageData of this.pages) {
			if (pageData.num === num) return pageData.text;
		}
		return '';
	}

	constructor(total: number) {
		this.total = total;
	}
}
