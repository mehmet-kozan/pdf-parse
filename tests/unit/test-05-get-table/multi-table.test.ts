import { data } from '../helper/multi-table';
import { PDFParse } from 'pdf-parse';
import { describe, expect, test } from 'vitest';

describe('test-10 empty table test', async () => {
	const buffer = await data.getBuffer();
	const parser = new PDFParse({ data: buffer });
	const result = await parser.getTable();

	test('table row col', () => {
		expect(result.total).toBe(data.total);

		expect(result.pages.length).toBe(1);
		expect(result.pages[0].tables.length).toBe(4);

		expect(result.pages[0].tables[0].length).toBe(4);
		expect(result.pages[0].tables[1].length).toBe(4);
		expect(result.pages[0].tables[2].length).toBe(4);
		expect(result.pages[0].tables[3].length).toBe(4);
	});

	test('table data', () => {
		expect(result.pages[0].tables[0]).toEqual(data.pages[0].tables[0]);
		expect(result.pages[0].tables[1]).toEqual(data.pages[0].tables[1]);
		expect(result.pages[0].tables[2]).toEqual(data.pages[0].tables[2]);
		expect(result.pages[0].tables[3]).toEqual(data.pages[0].tables[3]);
	});
});
