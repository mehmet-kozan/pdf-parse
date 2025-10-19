import { Line, LineDirection, LineStore, Point } from 'pdf-parse';
import { describe, expect, test } from 'vitest';

describe('basic geometry test', (): void => {
	test('line constructor', (): void => {
		const line_01 = new Line(new Point(0, 0), new Point(0, 0));
		expect(line_01.valid).toBe(false);

		const line_02 = new Line(new Point(0, 0), new Point(10, 0));
		expect(line_02.valid).toBe(true);
		expect(line_02.direction).toBe(LineDirection.Horizontal);
		expect(line_02.length).toBe(10);
	});

	test('line intersection', (): void => {
		const line_01 = new Line(new Point(0, 0), new Point(10, 0));
		const line_02 = new Line(new Point(5, 5), new Point(5, -5));
		const intersection = line_01.intersection(line_02);
		expect(intersection).toEqual(new Point(5, 0));
	});

	test('line intersection with tolerance', (): void => {
		const line_01 = new Line(new Point(0, 5), new Point(10, 5));
		const line_02 = new Line(new Point(5, 0), new Point(5, 3.5));
		const intersection = line_01.intersection(line_02);
		expect(intersection).toEqual(new Point(5, 5));
	});

	test('line intersection with invalid tolerance', (): void => {
		const line_01 = new Line(new Point(0, 5), new Point(10, 5));
		const line_02 = new Line(new Point(5, 0), new Point(5, 3));
		const intersection = line_01.intersection(line_02);
		expect(intersection).toEqual(undefined);
	});
});

describe('line store horizontal tests', (): void => {
	test('line store horizontal add', (): void => {
		const store = new LineStore();
		const line_01 = new Line(new Point(0, 0), new Point(10, 0));
		store.add(line_01);
		expect(store.hLines.length).toBe(1);
		expect(store.hLines[0]).toBe(line_01);
	});

	test('line store horizontal normalization of same lines', (): void => {
		const store = new LineStore();
		const line_01 = new Line(new Point(0, 0), new Point(10, 0));
		const line_02 = new Line(new Point(0, 0), new Point(10, 0));
		store.add(line_01);
		store.add(line_02);

		store.normalizeHorizontal();

		expect(store.hLines.length).toBe(1);
		expect(store.hLines[0]?.valid).toBe(line_01.valid);
		expect(store.hLines[0]).toStrictEqual(line_01);
	});

	test('line store horizontal normalization of 3 lines', (): void => {
		const store = new LineStore();
		const line_01 = new Line(new Point(15, 5), new Point(20, 5));
		const line_02 = new Line(new Point(10, 5), new Point(15, 5));
		const line_03 = new Line(new Point(5, 5), new Point(10, 5));
		store.add(line_01);
		store.add(line_02);
		store.add(line_03);

		store.normalizeHorizontal();

		const result = new Line(new Point(5, 5), new Point(20, 5));

		expect(store.hLines.length).toBe(1);
		expect(store.hLines[0]?.valid).toBe(result.valid);
		expect(store.hLines[0]).toStrictEqual(result);
	});

	test('line store horizontal normalization of 3 lines with tolerance', (): void => {
		const store = new LineStore();
		const line_01 = new Line(new Point(15, 5), new Point(25, 5));
		const line_02 = new Line(new Point(10, 5), new Point(14, 5));
		const line_03 = new Line(new Point(5, 5), new Point(9, 5));
		store.add(line_01);
		store.add(line_02);
		store.add(line_03);

		store.normalizeHorizontal();

		const result = new Line(new Point(5, 5), new Point(25, 5));

		expect(store.hLines.length).toBe(1);
		expect(store.hLines[0]?.valid).toBe(result.valid);
		expect(store.hLines[0]).toStrictEqual(result);
	});

	test('line store horizontal normalization of 5 lines', (): void => {
		const store = new LineStore();
		const line_01 = new Line(new Point(15, 5), new Point(20, 5));
		const line_02 = new Line(new Point(10, 5), new Point(15, 5));
		const line_03 = new Line(new Point(5, 5), new Point(10, 5));

		const line_04 = new Line(new Point(25, 11), new Point(30, 11));
		const line_05 = new Line(new Point(22, 11), new Point(25, 11));

		store.add(line_04);
		store.add(line_05);

		store.add(line_01);
		store.add(line_02);
		store.add(line_03);

		store.normalizeHorizontal();

		const result_01 = new Line(new Point(5, 5), new Point(20, 5));
		const result_02 = new Line(new Point(22, 11), new Point(30, 11));

		expect(store.hLines.length).toBe(2);
		expect(store.hLines[0]?.valid).toBe(result_01.valid);
		expect(store.hLines[0]).toStrictEqual(result_01);

		expect(store.hLines[1]?.valid).toBe(result_02.valid);
		expect(store.hLines[1]).toStrictEqual(result_02);
	});
});

describe('line store vertical tests', (): void => {
	test('line store vertical add', (): void => {
		const store = new LineStore();
		const line_01 = new Line(new Point(0, 0), new Point(0, 10));
		store.add(line_01);
		expect(store.vLines.length).toBe(1);
		expect(store.vLines[0]).toBe(line_01);
	});

	test('line store vertical normalization of same lines', (): void => {
		const store = new LineStore();
		const line_01 = new Line(new Point(0, 0), new Point(0, 10));
		const line_02 = new Line(new Point(0, 0), new Point(0, 10));
		store.add(line_01);
		store.add(line_02);

		store.normalizeVertical();

		expect(store.vLines.length).toBe(1);
		expect(store.vLines[0]?.valid).toBe(line_01.valid);
		expect(store.vLines[0]).toStrictEqual(line_01);
	});

	test('line store vertical normalization of 3 lines', (): void => {
		const store = new LineStore();
		const line_01 = new Line(new Point(5, 15), new Point(5, 20));
		const line_02 = new Line(new Point(5, 10), new Point(5, 15));
		const line_03 = new Line(new Point(5, 5), new Point(5, 10));
		store.add(line_01);
		store.add(line_02);
		store.add(line_03);

		store.normalizeVertical();

		const result = new Line(new Point(5, 5), new Point(5, 20));

		expect(store.vLines.length).toBe(1);
		expect(store.vLines[0]?.valid).toBe(result.valid);
		expect(store.vLines[0]).toStrictEqual(result);
	});

	test('line store vertical normalization of 3 lines with tolerance', (): void => {
		const store = new LineStore();
		const line_01 = new Line(new Point(5, 15), new Point(5, 25));
		const line_02 = new Line(new Point(5, 10), new Point(5, 15));
		const line_03 = new Line(new Point(5, 5), new Point(5, 9));
		store.add(line_01);
		store.add(line_02);
		store.add(line_03);

		store.normalizeVertical();

		const result = new Line(new Point(5, 5), new Point(5, 25));

		expect(store.vLines.length).toBe(1);
		expect(store.vLines[0]?.valid).toBe(result.valid);
		expect(store.vLines[0]).toStrictEqual(result);
	});

	test('line store vertical normalization of 5 lines', (): void => {
		const store = new LineStore();
		const line_01 = new Line(new Point(5, 15), new Point(5, 20));
		const line_02 = new Line(new Point(5, 10), new Point(5, 15));
		const line_03 = new Line(new Point(5, 5), new Point(5, 10));

		const line_04 = new Line(new Point(11, 25), new Point(11, 30));
		const line_05 = new Line(new Point(11, 22), new Point(11, 25));

		store.add(line_04);
		store.add(line_05);

		store.add(line_01);
		store.add(line_02);
		store.add(line_03);

		store.normalizeVertical();

		const result_01 = new Line(new Point(5, 5), new Point(5, 20));
		const result_02 = new Line(new Point(11, 22), new Point(11, 30));

		expect(store.vLines.length).toBe(2);
		expect(store.vLines[0]?.valid).toBe(result_01.valid);
		expect(store.vLines[0]).toStrictEqual(result_01);

		expect(store.vLines[1]?.valid).toBe(result_02.valid);
		expect(store.vLines[1]).toStrictEqual(result_02);
	});
});

describe('line store parallel same lines tests', (): void => {
	test('line store horizontal same test', (): void => {
		const store = new LineStore();
		const line_01 = new Line(new Point(0, 10), new Point(500, 10));
		const line_02 = new Line(new Point(0, 10), new Point(500, 10));
		store.add(line_01);
		store.add(line_02);
		store.normalize();
		expect(store.hLines.length).toBe(1);
	});

	test('line store horizontal same test - horizontal tolerance', (): void => {
		const store = new LineStore();
		const line_01 = new Line(new Point(1.1, 10), new Point(500.2, 10));
		const line_02 = new Line(new Point(0, 10), new Point(501.1, 10));
		store.add(line_01);
		store.add(line_02);
		store.normalize();
		expect(store.hLines.length).toBe(1);
	});

	test('line store horizontal same test - vertical tolerance', (): void => {
		const store = new LineStore();
		const line_01 = new Line(new Point(1.1, 10.1), new Point(500.2, 10.1));
		const line_02 = new Line(new Point(0, 10), new Point(501.1, 10));
		store.add(line_01);
		store.add(line_02);
		store.normalize();
		expect(store.hLines.length).toBe(1);
	});

	test('line store vertical same test', (): void => {
		const store = new LineStore();
		const line_01 = new Line(new Point(10, 0), new Point(10, 500));
		const line_02 = new Line(new Point(10, 0), new Point(10, 500));
		store.add(line_01);
		store.add(line_02);
		store.normalize();
		expect(store.vLines.length).toBe(1);
	});

	test('line store vertical same test - horizontal tolerance', (): void => {
		const store = new LineStore();
		const line_01 = new Line(new Point(10, 1.1), new Point(10, 500.2));
		const line_02 = new Line(new Point(10, 0), new Point(10, 501.1));
		store.add(line_01);
		store.add(line_02);
		store.normalize();
		expect(store.vLines.length).toBe(1);
	});

	test('line store vertical same test - horizontal tolerance', (): void => {
		const store = new LineStore();
		const line_01 = new Line(new Point(10.1, 1.1), new Point(10.1, 500.2));
		const line_02 = new Line(new Point(10, 0), new Point(10, 501.1));
		store.add(line_01);
		store.add(line_02);
		store.normalize();
		expect(store.vLines.length).toBe(1);
	});
});
