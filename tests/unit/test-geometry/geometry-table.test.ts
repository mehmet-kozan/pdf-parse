import { describe, expect, test } from 'vitest';

import { Line } from '../../../src/geometry/Line';
import { LineStore } from '../../../src/geometry/LineStore';
import { Point } from '../../../src/geometry/Point';

describe('basic table test', (): void => {
	const hLines: Array<Line> = [
		new Line(new Point(0, 0), new Point(20, 0)),
		new Line(new Point(0, 5), new Point(20, 5)),
		new Line(new Point(0, 10), new Point(20, 10)),
		new Line(new Point(0, 15), new Point(20, 15)),
		new Line(new Point(0, 20), new Point(20, 20)),
	];

	const vLines: Array<Line> = [
		new Line(new Point(0, 0), new Point(0, 20)),
		new Line(new Point(5, 0), new Point(5, 20)),
		new Line(new Point(10, 0), new Point(10, 20)),
		new Line(new Point(15, 0), new Point(15, 20)),
		new Line(new Point(20, 0), new Point(20, 20)),
	];

	test('line store,table test', (): void => {
		const store = new LineStore();

		for (const line of hLines) {
			store.add(line);
		}

		for (const line of vLines) {
			store.add(line);
		}

		store.normalize();

		const table = store.getTables();
		const tableData = table[0]?.toData();
		expect(tableData?.minXY.equal(new Point(0, 0))).toBeTruthy();
		expect(tableData?.maxXY.equal(new Point(20, 20))).toBeTruthy();
		expect(tableData?.rowCount).toBe(4);
		expect(tableData?.cellCount).toBe(16);
		expect(tableData?.check()).toBe(true);
	});
});

describe('rowspan table test', (): void => {
	const hLines: Array<Line> = [
		new Line(new Point(0, 0), new Point(20, 0)),
		new Line(new Point(10, 5), new Point(20, 5)),
		new Line(new Point(0, 10), new Point(20, 10)),
	];

	const vLines: Array<Line> = [
		new Line(new Point(0, 0), new Point(0, 10)),
		new Line(new Point(10, 0), new Point(10, 10)),
		new Line(new Point(20, 0), new Point(20, 10)),
	];

	test('line store, rowspan table test', (): void => {
		const store = new LineStore();

		for (const line of hLines) {
			store.add(line);
		}

		for (const line of vLines) {
			store.add(line);
		}

		store.normalize();

		const table = store.getTables();
		const tableData = table[0]?.toData();
		expect(tableData?.minXY.equal(new Point(0, 0))).toBeTruthy();
		expect(tableData?.maxXY.equal(new Point(20, 10))).toBeTruthy();
		expect(tableData?.rowCount).toBe(2);
		expect(tableData?.cellCount).toBe(3);
		expect(tableData?.check()).toBe(true);
	});
});

describe('rowspan & colspan table test', (): void => {
	const hLines: Array<Line> = [
		new Line(new Point(0, 0), new Point(20, 0)),
		new Line(new Point(10, 5), new Point(20, 5)),
		new Line(new Point(0, 10), new Point(20, 10)),
	];

	const vLines: Array<Line> = [
		new Line(new Point(0, 0), new Point(0, 10)),
		new Line(new Point(10, 0), new Point(10, 10)),
		new Line(new Point(15, 5), new Point(15, 10)),
		new Line(new Point(20, 0), new Point(20, 10)),
	];

	test('line store, rowspan  & colspan table test', (): void => {
		const store = new LineStore();

		for (const line of hLines) {
			store.add(line);
		}

		for (const line of vLines) {
			store.add(line);
		}

		store.normalize();

		const table = store.getTables();
		const tableData = table[0]?.toData();
		expect(tableData?.minXY.equal(new Point(0, 0))).toBeTruthy();
		expect(tableData?.maxXY.equal(new Point(20, 10))).toBeTruthy();
		expect(tableData?.rowCount).toBe(2);
		expect(tableData?.cellCount).toBe(4);
		expect(tableData?.check()).toBe(true);
	});
});
