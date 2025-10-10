import type { TextItem } from 'pdfjs-dist/types/src/display/api.js';
import { describe, expect, test } from 'vitest';
import { Rectangle, Table } from '../../src/TableUtil';

describe('Rectangle basic tests', (): void => {
	test('constructor works', (): void => {
		const rect = new Rectangle(1, 10, 20, 30, 40);
		expect(rect.id).toBe(1);
		expect(rect.x).toBe(10);
		expect(rect.y).toBe(20);
		expect(rect.width).toBe(30);
		expect(rect.height).toBe(40);
		expect(rect.x2).toBe(40); // x + width
		expect(rect.y2).toBe(60); // y + height
		expect(rect.text).toBe('');
	});

	test('tryAddText adds text only when inside', (): void => {
		const rect = new Rectangle(2, 0, 0, 100, 10);
		// Minimal TextItem shape the implementation expects
		const insideItem = { transform: [0, 0, 0, 0, 10, 5], str: 'hello', hasEOL: false } as TextItem;
		const outsideItem = { transform: [0, 0, 0, 0, 200, 200], str: 'world', hasEOL: true } as TextItem;

		expect(rect.tryAddText(outsideItem)).toBe(false);
		expect(rect.text).toBe('');

		expect(rect.tryAddText(insideItem)).toBe(true);
		expect(rect.text).toBe('hello');

		// adding empty string with hasEOL shouldn't change text if already empty
		const emptyItem = { transform: [0, 0, 0, 0, 11, 6], str: '', hasEOL: true } as TextItem;
		// since rect.text is non-empty, emptyItem will be appended ('' + '\n') -> '\n' at end
		expect(rect.tryAddText(emptyItem)).toBe(true);
		expect(rect.text.endsWith('\n')).toBe(true);
	});

	test('isNeighbour detects adjacent directions', (): void => {
		const base = new Rectangle(10, 0, 0, 10, 10);
		const right = new Rectangle(11, 10, 0, 10, 10); // immediately to the right
		const left = new Rectangle(12, -10, 0, 10, 10); // immediately to the left (x = -10, x2 = 0)
		const top = new Rectangle(13, 0, -10, 10, 10); // immediately above
		const bottom = new Rectangle(14, 0, 10, 10, 10); // immediately below

		expect(base.isNeighbour(right)).toBeGreaterThan(0); // Right expected
		expect(base.isNeighbour(left)).toBeGreaterThan(0); // Left expected
		expect(base.isNeighbour(top)).toBeGreaterThan(0); // Top expected
		expect(base.isNeighbour(bottom)).toBeGreaterThan(0); // Bottom expected
	});
});

describe('Table basic tests', (): void => {
	test('constructor creates grid', (): void => {
		const rect = new Rectangle(1, 0, 0, 10, 10);
		const table = new Table(rect);
		expect(table.grid.length).toBe(1);
		expect(table.grid[0].length).toBe(1);
	});

	test('cellCount accounts for -1 initialization', (): void => {
		const rect = new Rectangle(1, 0, 0, 10, 10);
		const table = new Table(rect);
		// _cellCount starts at -1, so 1 cell row: -1 + 1 = 0
		expect(table.cellCount).toBe(0);
	});

	test('addRectangle joins tables and initMinMax/isInside/getTableArray/toString', (): void => {
		const pageTables: Array<Table> = [];

		const a = new Rectangle(1, 0, 0, 10, 10);
		const b = new Rectangle(2, 10, 0, 10, 10); // to the right of a
		const c = new Rectangle(3, 0, 10, 10, 10); // below a

		// add first rect -> creates new table
		expect(Table.addRectangle(pageTables, a)).toBe(true);
		expect(pageTables.length).toBe(1);

		// add right neighbor -> should be added to same row
		expect(Table.addRectangle(pageTables, b)).toBe(true);
		expect(pageTables.length).toBe(1);
		expect(pageTables[0].grid[0].length).toBeGreaterThan(1);

		// add bottom neighbor -> should create a new row in same table
		expect(Table.addRectangle(pageTables, c)).toBe(true);
		expect(pageTables.length).toBe(1);
		expect(pageTables[0].grid.length).toBeGreaterThan(1);

		// init min/max and test isInside
		pageTables[0].initMinMax();
		const fakeItemInside = { transform: [0, 0, 0, 0, 1, 1], str: 'x', hasEOL: false } as TextItem;
		const fakeItemOutside = { transform: [0, 0, 0, 0, 999, 999], str: 'y', hasEOL: false } as TextItem;

		expect(pageTables[0].isInside(fakeItemInside)).toBe(true);
		expect(pageTables[0].isInside(fakeItemOutside)).toBe(false);

		// fill some text and check getTableArray and toString
		pageTables[0].grid[0][0].text = 'cell-a';
		pageTables[0].grid[0][1].text = 'cell-b';
		pageTables[0].grid[1][0].text = 'cell-c';

		expect(pageTables[0].getTableArray()).toEqual([['cell-a', 'cell-b'], ['cell-c']]);
		expect(pageTables[0].toString()).toContain('cell-a');
	});

	test('tryAddText only adds to tables with enough cells', (): void => {
		const pageTables: Array<Table> = [];
		const single = new Rectangle(1, 0, 0, 10, 10);
		Table.addRectangle(pageTables, single);
		// This table has cellCount 0 (cached behavior), so tryAddText should not add
		const item = { transform: [0, 0, 0, 0, 1, 1], str: 'z', hasEOL: false } as TextItem;
		expect(Table.tryAddText(pageTables, item)).toBe(false);
	});
});
