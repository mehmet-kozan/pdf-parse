import type { TextItem, TextStyle } from 'pdfjs-dist/types/src/display/api.js';
import type { PageViewport } from 'pdfjs-dist/types/src/display/display_utils.js';

export class TextContentLine {
	public static heightStat: Map<number, number> = new Map();
	public static fontLengthStat: Map<number, number> = new Map();
	public pageNumber: number;
	public item: TextItem;
	public style: TextStyle;
	public next: TextContentLine | null;
	public x: number;
	public y: number;
	public netX: number;
	public maxHeight: number;
	public isBigger: boolean = false;
	public get fontHeight(): number {
		const val = this.style.ascent + Math.abs(this.style.descent);
		return Math.round(val * 10000) / 10000;
	}
	public get first() {
		return this;
	}
	public get last() {
		let current: TextContentLine = this;
		while (current.next !== null) current = current.next;
		return current;
	}

	constructor(item: TextItem, style: TextStyle, viewport: PageViewport, pageNumber: number) {
		this.pageNumber = pageNumber;
		this.item = item;
		this.style = style;
		this.next = null;
		this.item.height = Math.round(item.height * 10000) / 10000;
		this.maxHeight = this.item.height;

		const [x, y] = viewport.convertToViewportPoint(item.transform[4], item.transform[5]);
		this.x = x;
		this.y = y;
		this.netX = Math.round(x);
		this.setStat();
	}

	private setStat() {
		const key = this.item.height;
		const val = TextContentLine.heightStat.get(key);
		if (val) {
			TextContentLine.heightStat.set(key, val + this.item.str.length);
		} else {
			TextContentLine.heightStat.set(key, this.item.str.length);
		}

		const fkey = this.fontHeight;
		const fval = TextContentLine.fontLengthStat.get(fkey);
		if (fval) {
			TextContentLine.fontLengthStat.set(fkey, fval + this.item.str.length);
		} else {
			TextContentLine.fontLengthStat.set(fkey, this.item.str.length);
		}
	}

	public addNext(next: TextContentLine) {
		this.last.next = next;
		this.maxHeight = Math.max(this.maxHeight, next.maxHeight);
	}

	public static computeHeightMetrics() {
		let maxCount = -1;
		let mainHeight = -1;
		let peakHeight = -1;
		for (const [height, count] of TextContentLine.heightStat) {
			if (height > peakHeight) {
				peakHeight = height;
			}

			if (count > maxCount) {
				maxCount = count;
				mainHeight = height;
			}
		}
		return [peakHeight, mainHeight];
	}

	public toString(): string {
		const parts: string[] = [];
		let current: TextContentLine | null = this;
		while (current !== null) {
			parts.push(current.item.str);
			if (current.item.hasEOL) parts.push(' ');
			current = current.next;
		}

		let result = parts.join('').trim();
		result = result.replace(/ {2,}/g, ' ').trim();
		result = result.replace(/(\b\p{L}\b)\s+(?=\b\p{L}\b)/gu, '$1');
		result = result.replaceAll('- ', '');

		return result;
	}
}
