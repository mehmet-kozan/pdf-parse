import type { Point } from './Point.js';

export type TableCell = {
	minXY: Point;
	maxXY: Point;
	width: number;
	height: number;
	colspan?: number;
	rowspan?: number;
	text: Array<string>;
};

export type TableRow = Array<TableCell>;

export class TableData {
	public minXY: Point;
	public maxXY: Point;
	public rows: Array<TableRow>;
	private rowPivots: Array<number>;
	private colPivots: Array<number>;

	constructor(minXY: Point, maxXY: Point, rowPivots: Array<number>, colPivots: Array<number>) {
		this.minXY = minXY;
		this.maxXY = maxXY;
		this.rows = [];
		this.rowPivots = rowPivots;
		this.colPivots = colPivots;
	}

	public findCell(x: number, y: number): TableCell | undefined {
		if (x >= this.minXY.x && y >= this.minXY.y && x <= this.maxXY.x && y <= this.maxXY.y) {
			for (const row of this.rows) {
				for (const cell of row) {
					if (cell.minXY.x <= x && cell.minXY.y <= y && cell.maxXY.x >= x && cell.maxXY.y >= y) {
						return cell;
					}
				}
			}
		}

		return undefined;
	}

	public get cellCount() {
		return this.rows.reduce((acc, row) => acc + row.length, 0);
	}

	public get rowCount() {
		return this.rows.length;
	}

	public check(): boolean {
		// const cellCounts:Array<number> = []
		//
		// for (const row of this.rows) {
		//     let cellNum = 0
		//     for (const cell of row) {
		//         cellNum += cell.colspan || 1
		//     }
		//     cellCounts.push(cellNum)
		// }
		//
		// for (let i = 1; i < cellCounts.length; i++) {
		//     if (cellCounts[i] !== cellCounts[i - 1]) {
		//         return false
		//     }
		// }

		const virtualCellCount = (this.colPivots.length - 1) * (this.rowPivots.length - 1);
		let allCellCount = 0;

		for (const row of this.rows) {
			for (const cell of row) {
				const count = (cell.colspan || 1) * (cell.rowspan || 1);
				allCellCount += count;
			}
		}

		if (virtualCellCount !== allCellCount) {
			return false;
		}

		return true;
	}

	public toArray(): string[][] {
		const tableArr: string[][] = [];
		for (const row of this.rows) {
			const rowArr: string[] = [];
			for (const cell of row) {
				let text = cell.text.join('');
				text = text.replace(/^[\s]+|[\s]+$/g, '');
				text = text.trim();
				rowArr.push(text);
			}
			tableArr.push(rowArr);
		}
		return tableArr;
	}
}
