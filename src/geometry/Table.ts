import { Line, LineDirection } from './Line.js';
import { Point } from './Point.js';
import { Shape } from './Shape.js';
import { type TableCell, TableData, type TableRow } from './TableData.js';

export class Table {
	public hLines: Array<Line> = [];
	public vLines: Array<Line> = [];

	constructor(line: Line) {
		if (line.direction === LineDirection.Horizontal) {
			this.hLines.push(line);
		} else if (line.direction === LineDirection.Vertical) {
			this.vLines.push(line);
		}
	}

	public get isValid(): boolean {
		return this.hLines.length + this.vLines.length > 4;
	}

	public get rowPivots(): Array<number> {
		const rowSet: Set<number> = new Set();

		for (const line of this.hLines) {
			rowSet.add(line.from.y);
		}

		return [...rowSet].sort((a, b) => a - b);
	}

	public get colPivots(): Array<number> {
		const colSet: Set<number> = new Set();

		for (const line of this.vLines) {
			colSet.add(line.from.x);
		}

		return [...colSet].sort((a, b) => a - b);
	}

	public add(line: Line): boolean {
		const hasIntersection = this.intersection(line);

		if (hasIntersection) {
			if (line.direction === LineDirection.Horizontal) {
				this.hLines.push(line);
				return true;
			} else if (line.direction === LineDirection.Vertical) {
				this.vLines.push(line);
				return true;
			}
		}

		return false;
	}

	private intersection(line: Line): boolean {
		let flag = false;
		if (!line.valid) return flag;

		if (line.direction === LineDirection.Horizontal) {
			for (const vLine of this.vLines) {
				const p = line.intersection(vLine);
				if (p) {
					flag = true;
				}
			}
		} else if (line.direction === LineDirection.Vertical) {
			for (const hLine of this.hLines) {
				const p = line.intersection(hLine);
				if (p) {
					flag = true;
				}
			}
		}
		return flag;
	}

	private getSameHorizontal(line: Line): Array<Line> {
		const same: Array<Line> = [line];
		const other: Array<Line> = [];

		while (this.hLines.length > 0) {
			const hLine = this.hLines.shift();
			if (!hLine) continue;

			if (hLine.from.y === line.from.y) {
				same.push(hLine);
			} else {
				other.push(hLine);
			}
		}

		this.hLines = other;
		return same;
	}

	private getSameVertical(line: Line): Array<Line> {
		const same: Array<Line> = [line];
		const other: Array<Line> = [];

		while (this.vLines.length > 0) {
			const vLine = this.vLines.shift();
			if (!vLine) continue;

			if (vLine.from.x === line.from.x) {
				same.push(vLine);
			} else {
				other.push(vLine);
			}
		}

		this.vLines = other;
		return same;
	}

	private mergeHorizontalLines(lines: Array<Line>): Line {
		lines.sort((l1, l2) => l1.from.x - l2.from.x);

		const minX = lines[0].from.x;
		const maxX = lines[lines.length - 1].to.x;

		const resultLine = new Line(new Point(minX, lines[0].from.y), new Point(maxX, lines[0].from.y));

		for (let i = 1; i < lines.length; i++) {
			const prevLine = lines[i - 1];
			const currLine = lines[i];

			if (Math.abs(prevLine.to.x - currLine.from.x) > Shape.tolerance) {
				const gapLine = new Line(new Point(prevLine.to.x, prevLine.from.y), new Point(currLine.from.x, currLine.from.y));
				resultLine.addGap(gapLine);
			}
		}

		return resultLine;
	}

	private mergeVerticalLines(lines: Array<Line>): Line {
		lines.sort((l1, l2) => l1.from.y - l2.from.y);

		const minY = lines[0].from.y;
		const maxY = lines[lines.length - 1].to.y;

		const resultLine = new Line(new Point(lines[0].from.x, minY), new Point(lines[0].from.x, maxY));

		for (let i = 1; i < lines.length; i++) {
			const prevLine = lines[i - 1];
			const currLine = lines[i];

			if (Math.abs(prevLine.to.y - currLine.from.y) > Shape.tolerance) {
				const gapLine = new Line(new Point(prevLine.to.x, prevLine.to.y), new Point(prevLine.to.x, currLine.from.y));
				resultLine.addGap(gapLine);
			}
		}

		return resultLine;
	}

	public normalize(): void {
		this.hLines = this.hLines.filter((l) => l.intersections.length > 1);
		this.vLines = this.vLines.filter((l) => l.intersections.length > 1);

		this.hLines.sort((l1, l2) => l1.from.y - l2.from.y);
		this.vLines.sort((l1, l2) => l1.from.x - l2.from.x);

		const newHLines: Array<Line> = [];

		while (this.hLines.length > 0) {
			const line = this.hLines.shift();
			if (!line) continue;

			const lines = this.getSameHorizontal(line);
			const merged = this.mergeHorizontalLines(lines);
			newHLines.push(merged);
		}

		this.hLines = newHLines;

		const newVLines: Array<Line> = [];

		while (this.vLines.length > 0) {
			const line = this.vLines.shift();
			if (!line) continue;

			const lines = this.getSameVertical(line);
			const merged = this.mergeVerticalLines(lines);
			newVLines.push(merged);
		}

		this.vLines = newVLines;
	}

	public verticalExists(line: Line, y1: number, y2: number): boolean {
		if (line.direction !== LineDirection.Vertical) {
			throw new Error('Line is not vertical');
		}

		if (y1 >= y2) {
			throw new Error('y1 must be less than y2');
		}

		if (line.from.y <= y1 && line.to.y >= y2) {
			for (const gap of line.gaps) {
				if (gap.from.y <= y1 && gap.to.y >= y2) {
					return false;
				}
			}
			return true;
		}

		return false;
	}

	public horizontalExists(line: Line, x1: number, x2: number): boolean {
		if (line.direction !== LineDirection.Horizontal) {
			throw new Error('Line is not horizontal');
		}

		if (x1 >= x2) {
			throw new Error('x1 must be less than x2');
		}

		if (line.from.x <= x1 && line.to.x >= x2) {
			for (const gap of line.gaps) {
				if (gap.from.x <= x1 && gap.to.x >= x2) {
					return false;
				}
			}
			return true;
		}

		return false;
	}

	private findBottomLineIndex(h2Index: number, xMiddle: number): number {
		for (let i = h2Index; i < this.hLines.length; i++) {
			const hLine = this.hLines[i];
			if (hLine.from.x <= xMiddle && hLine.to.x >= xMiddle) {
				return i;
			}
		}
		return -1;
	}

	private findVerticalLineIndexs(topHLine: Line, yMiddle: number): Array<number> {
		const result: Array<number> = [];

		for (let i = 0; i < this.vLines.length; i++) {
			const vLine = this.vLines[i];
			if (vLine.from.y <= yMiddle && vLine.to.y >= yMiddle && topHLine.intersection(vLine)) {
				result.push(i);
			}
		}

		return result;
	}

	private getRow(h1Index: number, h2Index: number, yMiddle: number): TableRow {
		const tableRow: TableRow = [];
		//const colCount = this.vLines.length -1
		const topHLine = this.hLines[h1Index];
		const vLineIndexes = this.findVerticalLineIndexs(topHLine, yMiddle);

		for (let i = 1; i < vLineIndexes.length; i++) {
			const leftVLine = this.vLines[vLineIndexes[i - 1]];
			const rightVLine = this.vLines[vLineIndexes[i]];
			const xMiddle = (leftVLine.from.x + rightVLine.from.x) / 2;
			const bottomHLineIndex = this.findBottomLineIndex(h2Index, xMiddle);
			const bottomHLine = this.hLines[bottomHLineIndex];
			// minXY: {x:leftVLine.from.x,y:topHLine.from.y},
			// maxXY: {x:rightVLine.from.x,y:bottomHLine.from.y},
			const tableCell: TableCell = {
				minXY: new Point(leftVLine.from.x, topHLine.from.y),
				maxXY: new Point(rightVLine.from.x, bottomHLine.from.y),
				width: rightVLine.from.x - leftVLine.from.x,
				height: bottomHLine.from.y - topHLine.from.y,
				text: [],
			};
			const colSpan = vLineIndexes[i] - vLineIndexes[i - 1];
			const rowSpan = bottomHLineIndex - h1Index;

			if (colSpan > 1) {
				tableCell.colspan = colSpan;
			}
			if (rowSpan > 1) {
				tableCell.rowspan = rowSpan;
			}

			tableRow.push(tableCell);
		}

		return tableRow;
	}

	public toData(): TableData {
		const rowPivots = this.rowPivots;
		const colPivots = this.colPivots;

		const minXY = new Point(colPivots[0], rowPivots[0]);
		const maxXY = new Point(colPivots[colPivots.length - 1], rowPivots[rowPivots.length - 1]);

		const result: TableData = new TableData(minXY, maxXY, rowPivots, colPivots);

		for (let h1 = 1; h1 < this.hLines.length; h1++) {
			const prevHLine = this.hLines[h1 - 1];
			const currHLine = this.hLines[h1];
			const YMiddle = (prevHLine.from.y + currHLine.from.y) / 2;
			const rowData = this.getRow(h1 - 1, h1, YMiddle);
			result.rows.push(rowData);
		}

		return result;
	}
}
