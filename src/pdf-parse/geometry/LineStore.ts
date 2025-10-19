import { Line, LineDirection } from './Line.js';
import { Point } from './Point.js';
import type { Rectangle } from './Rectangle.js';
import { Shape } from './Shape.js';
import { Table } from './Table.js';
import type { TableData } from './TableData.js';

export class LineStore {
	public hLines: Array<Line> = [];
	public vLines: Array<Line> = [];

	public add(line: Line): void {
		if (line.valid) {
			if (line.direction === LineDirection.Horizontal) {
				this.hLines.push(line);
			} else if (line.direction === LineDirection.Vertical) {
				this.vLines.push(line);
			}
		}
	}

	public addRectangle(rect: Rectangle): void {
		for (const line of rect.getLines()) {
			this.add(line);
		}
	}

	public getTableData(): Array<TableData> {
		const result: Array<TableData> = [];

		const tables = this.getTables();

		for (const table of tables) {
			const data = table.toData();
			if (data) {
				result.push(data);
			}
		}

		return result;
	}

	public getTables(): Array<Table> {
		const result: Array<Table> = [];

		while (this.hLines.length !== 0) {
			const hLine = this.hLines.shift();
			if (!hLine) continue;

			const filled = this.tryFill(result, hLine);
			if (filled) continue;

			const table = new Table(hLine);
			this.fillTable(table);
			result.push(table);
		}

		while (this.vLines.length !== 0) {
			const vLine = this.vLines.shift();
			if (!vLine) continue;

			const filled = this.tryFill(result, vLine);
			if (filled) continue;

			const table = new Table(vLine);
			this.fillTable(table);
			result.push(table);
		}

		const validTables = result.filter((t) => t.isValid);

		for (const table of validTables) {
			table.normalize();
		}

		return validTables;
	}

	public normalize(): void {
		this.normalizeHorizontal();
		this.normalizeVertical();
	}

	public normalizeHorizontal() {
		this.hLines.sort((l1, l2) => l1.from.y - l2.from.y);

		const newLines: Array<Line> = [];

		let sameY: Array<Line> = [];
		for (const line of this.hLines) {
			if (sameY.length === 0) {
				sameY.push(line);
			} else if (Math.abs(sameY[0]?.from.y - line.from.y) < Shape.tolerance) {
				sameY.push(line);
			} else {
				const merged = this.margeHorizontalLines(sameY);
				newLines.push(...merged);
				sameY = [line];
			}
		}

		if (sameY.length > 0) {
			const merged = this.margeHorizontalLines(sameY);
			newLines.push(...merged);
		}

		this.hLines = newLines;
	}

	public normalizeVertical() {
		this.vLines.sort((l1, l2) => l1.from.x - l2.from.x);

		const newLines: Array<Line> = [];

		let sameX: Array<Line> = [];
		for (const line of this.vLines) {
			if (sameX.length === 0) {
				sameX.push(line);
			} else if (Math.abs(sameX[0]?.from.x - line.from.x) < Shape.tolerance) {
				sameX.push(line);
			} else {
				const merged = this.margeVerticalLines(sameX);
				newLines.push(...merged);
				sameX = [line];
			}
		}

		if (sameX.length > 0) {
			const merged = this.margeVerticalLines(sameX);
			newLines.push(...merged);
		}

		this.vLines = newLines;
	}

	private fillTable(table: Table): void {
		const newVLines: Array<Line> = [];
		const newHLines: Array<Line> = [];

		for (const vLine of this.vLines) {
			if (!table.add(vLine)) {
				newVLines.push(vLine);
			}
		}

		for (const hLine of this.hLines) {
			if (!table.add(hLine)) {
				newHLines.push(hLine);
			}
		}

		this.hLines = newHLines;
		this.vLines = newVLines;
	}

	private tryFill(tables: Array<Table>, line: Line): boolean {
		for (const table of tables) {
			if (table.add(line)) {
				this.fillTable(table);
				return true;
			}
		}
		return false;
	}

	private margeHorizontalLines(sameYLines: Array<Line>): Array<Line> {
		const result: Array<Line> = [];
		sameYLines.sort((l1, l2) => l1.from.x - l2.from.x);

		const sameY = sameYLines[0]?.from.y;
		if (sameY === undefined) return result;

		let minX: number = Number.MAX_SAFE_INTEGER;
		let maxX: number = Number.MIN_SAFE_INTEGER;

		for (const line of sameYLines) {
			if (line.from.x - maxX < Shape.tolerance) {
				if (line.from.x < minX) {
					minX = line.from.x;
				}
				if (line.to.x > maxX) {
					maxX = line.to.x;
				}
			} else {
				if (maxX > minX) {
					result.push(new Line(new Point(minX, sameY), new Point(maxX, sameY)));
				}
				minX = line.from.x;
				maxX = line.to.x;
			}
		}

		const last = result[result.length - 1];

		if (last) {
			if (last.from.x !== minX && last.to.x !== maxX) {
				result.push(new Line(new Point(minX, sameY), new Point(maxX, sameY)));
			}
		} else {
			result.push(new Line(new Point(minX, sameY), new Point(maxX, sameY)));
		}

		return result;
	}

	private margeVerticalLines(sameXLines: Array<Line>): Array<Line> {
		const result: Array<Line> = [];
		sameXLines.sort((l1, l2) => l1.from.y - l2.from.y);

		const sameX = sameXLines[0]?.from.x;
		if (sameX === undefined) return result;

		let minY: number = Number.MAX_SAFE_INTEGER;
		let maxY: number = Number.MIN_SAFE_INTEGER;

		for (const line of sameXLines) {
			if (line.from.y - maxY < Shape.tolerance) {
				if (line.from.y < minY) {
					minY = line.from.y;
				}
				if (line.to.y > maxY) {
					maxY = line.to.y;
				}
			} else {
				if (maxY > minY) {
					result.push(new Line(new Point(sameX, minY), new Point(sameX, maxY)));
				}
				minY = line.from.y;
				maxY = line.to.y;
			}
		}

		const last = result[result.length - 1];

		if (last) {
			if (last.from.y !== minY && last.to.y !== maxY) {
				result.push(new Line(new Point(sameX, minY), new Point(sameX, maxY)));
			}
		} else {
			result.push(new Line(new Point(sameX, minY), new Point(sameX, maxY)));
		}

		return result;
	}
}
