export type ParagraphLine = {
	str: string;
	lastY: number;
	charWidth: number;
	width: number;
	firstFont: string;
	lastFont: string;
	minX: number;
	maxX: number;
	maxHeight: number;
};

// const heightMap: Map<number, { count: number; x: Map<number, number>; width: Map<number, number> }> = new Map();

export class HeightMap {
	data: Map<number, { count: number; x: Map<number, number>; width: Map<number, number> }>;
	mainHeight: number = -1;

	constructor(lines: ParagraphLine[]) {
		this.data = new Map();
		this.loadData(lines);
		this.processData();
	}

	private loadData(lines: ParagraphLine[]) {
		for (const line of lines) {
			line.maxHeight = Math.round(line.maxHeight * 1000) / 1000;
			line.minX = Math.round(line.minX);
			line.width = Math.round(line.width);

			const hVal = this.data.get(line.maxHeight);

			if (hVal !== undefined) {
				hVal.count += line.str.length;

				const xVal = hVal.x.get(line.minX);

				if (xVal) {
					hVal.x.set(line.minX, xVal + 1);
				} else {
					hVal.x.set(line.minX, 1);
				}

				const widthVal = hVal.width.get(line.minX);

				if (widthVal) {
					hVal.width.set(line.width, widthVal + 1);
				} else {
					hVal.width.set(line.width, 1);
				}

				this.data.set(line.maxHeight, hVal);
			} else {
				this.data.set(line.maxHeight, {
					count: line.str.length ?? 0,
					x: new Map<number, number>([[line.minX, 1]]),
					width: new Map<number, number>([[line.width, 1]]),
				});
			}
		}
	}

	private processData(): void {
		// En sık kullanılan (en yüksek count) height değerini bul
		let maxCount = -1;
		for (const [height, info] of this.data) {
			// info: { count: number; x: Map<number, number>; width: Map<number, number> }
			if (info.count > maxCount) {
				maxCount = info.count;
				this.mainHeight = height;
			}
		}
	}
}
