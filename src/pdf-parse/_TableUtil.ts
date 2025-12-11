import type { TextItem } from 'pdfjs-dist/types/src/display/api.js';

enum RelativeDirections {
	None = 0,
	Left,
	Right,
	Top,
	Bottom,
}

export class Rectangle {
	public id: number;
	public x: number;
	public y: number;
	public width: number;
	public height: number;
	public x2: number;
	public y2: number;
	public text: string;

	constructor(id: number, x: number, y: number, width: number, height: number) {
		this.id = id;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.x2 = x + width;
		this.y2 = y + height;
		this.text = '';
	}

	public toString(): string {
		return `${this.id} ${this.text}`;
	}

	public tryAddText(item: TextItem) {
		const x = item.transform[4];
		const y = item.transform[5];

		const isInside = x >= this.x && y >= this.y && x <= this.x2 && y <= this.y2;

		if (isInside) {
			if (item.str?.length === 0 && this.text.length === 0) {
				return true;
			}

			this.text += `${item.str}${item.hasEOL ? '\n' : ''}`;
			return true;
		}
		return false;
	}

	public isNeighbour(rect: Rectangle, distance: number = 1): RelativeDirections {
		const result: RelativeDirections = RelativeDirections.None;

		const heightOk = Math.abs(this.height - rect.height) < distance;
		const yOk = Math.abs(this.y - rect.y) < distance;

		if (heightOk && yOk) {
			const isLeft = Math.abs(this.x - rect.x2) < distance;
			if (isLeft) return RelativeDirections.Left;

			const isRight = Math.abs(this.x2 - rect.x) < distance;
			if (isRight) return RelativeDirections.Right;
		}

		const widthOk = Math.abs(this.width - rect.width) < distance;
		const xOk = Math.abs(this.x - rect.x) < distance;

		if (widthOk && xOk) {
			const isTop = Math.abs(this.y - rect.y2) < distance;
			if (isTop) return RelativeDirections.Top;

			const isBottom = Math.abs(this.y2 - rect.y) < distance;
			if (isBottom) return RelativeDirections.Bottom;
		}

		return result;
	}
}

type TableRow = Array<Rectangle>;

export class Table {
	public grid: Array<TableRow>;
	private minTableX1: number = Number.MAX_VALUE;
	private minTableY1: number = Number.MAX_VALUE;
	private maxTableX2: number = Number.MIN_VALUE;
	private maxTableY2: number = Number.MIN_VALUE;

	constructor(rect: Rectangle) {
		this.grid = [[rect]];
	}

	private _cellCount: number = -1;

	public get cellCount(): number {
		if (this._cellCount > -1) {
			return this._cellCount;
		}

		for (const row of this.grid) {
			this._cellCount += row.length;
		}

		return this._cellCount;
	}

	public get width(): number {
		return this.maxTableX2 - this.minTableX1;
	}

	public get height(): number {
		return this.maxTableY2 - this.minTableY1;
	}

	public static tryAddText(pageTables: Array<Table>, item: TextItem): boolean {
		for (const table of pageTables) {
			if (table.cellCount < 3) continue;
			if (table.isInside(item)) {
				for (const row of table.grid) {
					for (const rectangle of row) {
						const res = rectangle.tryAddText(item);
						if (res) return true;
					}
				}
			}
		}

		return false;
	}

	public static addRectangle(pageTables: Array<Table>, rect: Rectangle): boolean {
		for (const table of pageTables) {
			for (let rowIndex = 0; rowIndex < table.grid.length; rowIndex++) {
				const row = table.grid[rowIndex];
				for (let colIndex = 0; row && colIndex < row.length; colIndex++) {
					const currentRect = row[colIndex];
					const dir = currentRect?.isNeighbour(rect);

					if (dir === RelativeDirections.Right) {
						row.push(rect);
						return true;
					}

					if (dir === RelativeDirections.Bottom) {
						const bottomRow = table.grid[rowIndex + 1];
						if (bottomRow === undefined) {
							const newRow: TableRow = [rect];
							table.grid.push(newRow);
							return true;
						}
					}

					if (dir === RelativeDirections.Left || dir === RelativeDirections.Top) {
						// TODO remove
						// debugger;
					}
				}
			}
		}

		pageTables.push(new Table(rect));
		return true;
	}

	public getTableArray(): Array<Array<string>> {
		const result: Array<Array<string>> = [];
		for (const row of this.grid) {
			const rowStr: Array<string> = [];
			for (const rect of row) {
				rowStr.push(rect.text.trim());
			}
			result.push(rowStr);
		}
		return result;
	}

	public initMinMax(): void {
		const firstRow = this.grid[0];
		const lastRow = this.grid[this.grid.length - 1];

		if (firstRow === undefined || lastRow === undefined) {
			throw new Error('malformed table');
		}

		const firstRect = firstRow[0];
		const lastRect = lastRow[lastRow.length - 1];

		if (firstRect === undefined || lastRect === undefined) {
			throw new Error('malformed table');
		}

		this.minTableX1 = firstRect.x;
		this.minTableY1 = firstRect.y;
		this.maxTableX2 = lastRect.x2;
		this.maxTableY2 = lastRect.y2;
	}

	public isInside(item: TextItem) {
		const x = item.transform[4];
		const y = item.transform[5];

		return x >= this.minTableX1 && y >= this.minTableY1 && x <= this.maxTableX2 && y <= this.maxTableY2;
	}

	public toString(): string {
		const result: Array<string> = [];

		for (const row of this.grid) {
			const rowStr = row.map((i) => i.text).join('\t');
			result.push(rowStr);
		}

		return result.join('\n');
	}
}
